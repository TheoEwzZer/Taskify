import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { Member, MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/util";
import { Project } from "@/features/projects/types";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Models, Query } from "node-appwrite";
import { z } from "zod";
import { createTaskSchema } from "../schemas";
import { Task, TaskStatus } from "../types";

const transformValue: <T>(val: T | T[] | null | undefined) => T[] | null = (
  val
) => {
  if (Array.isArray(val)) {
    return val;
  } else if (val) {
    return [val];
  } else {
    return null;
  }
};

const app = new Hono()
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user: Models.User<Models.Preferences> = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    const task: Task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const member: Member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({ data: { $id: task.$id } });
  })
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z
          .union([z.string(), z.array(z.string())])
          .nullish()
          .transform(transformValue),
        assigneeId: z
          .union([z.string(), z.array(z.string())])
          .nullish()
          .transform(transformValue),
        status: z
          .union([z.nativeEnum(TaskStatus), z.array(z.nativeEnum(TaskStatus))])
          .nullish()
          .transform(transformValue),
        dueDate: z.string().nullish(),
        onlyAssigned: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user: Models.User<Models.Preferences> = c.get("user");

      const {
        workspaceId,
        projectId,
        assigneeId,
        status,
        dueDate,
        onlyAssigned,
      } = c.req.valid("query");

      const member: Member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const accessibleProjects: Models.DocumentList<Project> =
        await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
          Query.equal("workspaceId", workspaceId),
          Query.contains("assigneeIds", member.$id),
        ]);

      const accessibleProjectIds: string[] = accessibleProjects.documents.map(
        (project: Project): string => project.$id
      );

      const isAdmin: boolean = member.role === MemberRole.ADMIN;

      if (!isAdmin && accessibleProjectIds.length === 0) {
        return c.json({ data: { total: 0, documents: [] } });
      }

      const query: string[] = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
        Query.limit(5000),
      ];

      if (!isAdmin) {
        query.push(Query.contains("projectId", accessibleProjectIds));
      }

      if (projectId && projectId.length > 0) {
        query.push(Query.contains("projectId", projectId));
      }

      if (status && status.length > 0) {
        query.push(Query.contains("status", status));
      }

      if (onlyAssigned && onlyAssigned == "true") {
        query.push(Query.contains("assigneeIds", member.$id));
      } else if (assigneeId && assigneeId.length > 0) {
        query.push(Query.contains("assigneeIds", assigneeId));
      }

      if (dueDate) {
        query.push(Query.equal("dueDate", dueDate));
      }

      const tasks: Models.DocumentList<Task> =
        await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, query);

      const projectIds: string[] = tasks.documents.map(
        (task: Task): string => task.projectId
      );
      const assigneeIds: string[] = tasks.documents
        .flatMap((task: Task): string[] => task.assigneeIds)
        .filter(
          (id: string | undefined): id is string =>
            id !== undefined && id !== null && id !== "none"
        );

      const projects: Models.DocumentList<Project> =
        await databases.listDocuments<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          projectIds.length > 0
            ? [Query.contains("$id", projectIds), Query.limit(5000)]
            : [Query.limit(5000)]
        );

      const members: Models.DocumentList<Member> =
        await databases.listDocuments<Member>(
          DATABASE_ID,
          MEMBERS_ID,
          assigneeIds.length > 0
            ? [Query.contains("$id", assigneeIds), Query.limit(5000)]
            : [Query.limit(5000)]
        );

      const assignees: Member[] = await Promise.all(
        members.documents.map(async (member: Member) => {
          const user: Models.User<Models.Preferences> = await users.get(
            member.userId
          );

          return {
            ...member,
            name: user.name || user.email,
            email: user.email,
            avatar: user.prefs?.avatar,
          };
        })
      );

      const populatedTasks: Task[] = tasks.documents.map((task: Task) => {
        const project: Project | undefined = projects.documents.find(
          (project: Project): boolean => project.$id === task.projectId
        );

        const taskAssignees: Member[] = task.assigneeIds
          ? task.assigneeIds
              .map((assigneeId: string): Member | undefined => {
                return assignees.find(
                  (assignee: Member): boolean => assignee.$id === assigneeId
                );
              })
              .filter(
                (assignee: Member | undefined): assignee is Member =>
                  assignee !== undefined
              )
          : [];

        return {
          ...task,
          project,
          assignees: taskAssignees,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user: Models.User<Models.Preferences> = c.get("user");
      const databases = c.get("databases");
      const {
        name,
        status,
        workspaceId,
        projectId,
        dueDate,
        assigneeIds,
        description,
      } = c.req.valid("json");

      const member: Member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const highestPositionTask: Models.DocumentList<Task> =
        await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]);

      const newPosition: number =
        highestPositionTask.total > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task: Task = await databases.createDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeIds,
          position: newPosition,
          description,
        }
      );

      return c.json({ data: task });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user: Models.User<Models.Preferences> = c.get("user");
      const databases = c.get("databases");
      const { name, status, description, projectId, dueDate, assigneeIds } =
        c.req.valid("json");
      const { taskId } = c.req.param();

      const existingTask: Task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member: Member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task: Task = await databases.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          status,
          projectId,
          dueDate,
          assigneeIds,
          description,
        }
      );

      return c.json({ data: task });
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const currentUser: Models.User<Models.Preferences> = c.get("user");
    const databases = c.get("databases");
    const { users } = await createAdminClient();
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const currentMember: Member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const project: Project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );

    const assignees: Member[] = await Promise.all(
      task.assigneeIds.map(async (assigneeId: string) => {
        const member: Member = await databases.getDocument<Member>(
          DATABASE_ID,
          MEMBERS_ID,
          assigneeId
        );

        const user: Models.User<Models.Preferences> = await users.get(
          member.userId
        );

        return {
          ...member,
          name: user.name || user.email,
          email: user.email,
          avatar: user.prefs?.avatar,
        };
      })
    );

    const taskAssignees: Member[] = task.assigneeIds
      ? task.assigneeIds
          .map((assigneeId: string): Member | undefined => {
            return assignees.find(
              (assignee: Member): boolean => assignee.$id === assigneeId
            );
          })
          .filter(
            (assignee: Member | undefined): assignee is Member =>
              assignee !== undefined
          )
      : [];

    return c.json({
      data: {
        ...task,
        project,
        assignees: taskAssignees,
      },
    });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const user: Models.User<Models.Preferences> = c.get("user");
      const { tasks } = c.req.valid("json");

      const tasksToUpdate: Models.DocumentList<Task> =
        await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
          Query.contains(
            "$id",
            tasks.map(
              (task: {
                status: TaskStatus;
                $id: string;
                position: number;
              }): string => task.$id
            )
          ),
          Query.limit(5000),
        ]);

      const workspaceIds = new Set(
        tasksToUpdate.documents.map((task: Task): string => task.workspaceId)
      );
      if (workspaceIds.size !== 1) {
        return c.json(
          { error: "Tasks must belong to the same workspace" },
          400
        );
      }

      const workspaceId: string | undefined = workspaceIds
        .values()
        .next().value;

      if (!workspaceId) {
        return c.json({ error: "Invalid workspace ID" }, 400);
      }

      const member: Member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedTasks: Task[] = await Promise.all(
        tasks.map(
          async (task: {
            status: TaskStatus;
            $id: string;
            position: number;
          }): Promise<Task> => {
            const { $id, status, position } = task;
            return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, {
              status,
              position,
            });
          }
        )
      );

      return c.json({ data: updatedTasks });
    }
  );

export default app;
