import {
  DATABASE_ID,
  DATES_ID,
  IMAGES_BUCKET_ID,
  PROJECTS_ID,
  TASKS_ID,
} from "@/config";
import { Member, MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/util";
import { Task, TaskStatus } from "@/features/tasks/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { endOfWeek, startOfWeek, subWeeks } from "date-fns";
import { Hono } from "hono";
import { ID, Models, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { DateItem, Project, ProjectDates } from "../types";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user: Models.User<Models.Preferences> = c.get("user");

      const { name, image, workspaceId, startDate, endDate, label, dates } =
        c.req.valid("json");

      const assigneeIds: string[] = c.req.valid("json").assigneeIds || [];

      const member: Member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }

      if (!assigneeIds.includes(member.$id)) {
        assigneeIds.push(member.$id);
      }

      const project: Project = await databases.createDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
          startDate,
          assigneeIds,
          endDate,
          label,
        }
      );

      if (dates) {
        for (const date of dates) {
          await databases.createDocument(DATABASE_ID, DATES_ID, ID.unique(), {
            projectId: project.$id,
            title: date.title,
            date: date.date.toISOString(),
          });
        }
      }

      return c.json({ data: project });
    }
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user: Models.User<Models.Preferences> = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) {
        return c.json({ error: "Missing workspaceId" }, 400);
      }

      const member: Member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const isAdmin: boolean = member.role === MemberRole.ADMIN;

      const projects: Models.DocumentList<Project> =
        await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("$createdAt"),
          Query.limit(5000),
        ]);

      if (isAdmin) {
        return c.json({ data: projects });
      } else {
        const accessibleProjects: Project[] = projects.documents.filter(
          (project: Project): boolean =>
            project.assigneeIds.includes(member.$id)
        );

        const accessibleProjectsList: Models.DocumentList<Project> = {
          total: accessibleProjects.length,
          documents: accessibleProjects,
        };

        return c.json({ data: accessibleProjectsList });
      }
    }
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    const user: Models.User<Models.Preferences> = c.get("user");
    const databases = c.get("databases");

    const { projectId } = c.req.param();

    const project: Project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    if (!project) {
      return c.json({ error: "Not found" }, 404);
    }

    const member: Member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const dates: Models.DocumentList<ProjectDates> =
      await databases.listDocuments<ProjectDates>(DATABASE_ID, DATES_ID, [
        Query.equal("projectId", projectId),
      ]);

    const simplifiedDates: {
      date: string | Date;
      title: string;
    }[] = dates.documents.map(({ date, title }: ProjectDates) => ({
      date,
      title,
    }));

    return c.json({
      data: {
        ...project,
        dates: simplifiedDates,
      },
    });
  })
  .patch(
    "/:projectId",
    zValidator("json", updateProjectSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user: Models.User<Models.Preferences> = c.get("user");

      const { projectId } = c.req.param();
      const { name, image, startDate, endDate, assigneeIds, label, dates } =
        c.req.valid("json");

      const existingProject: Project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      if (!existingProject) {
        return c.json({ error: "Not found" }, 404);
      }

      const member: Member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }

      const project: Project = await databases.updateDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          startDate,
          endDate,
          imageUrl: uploadedImageUrl,
          assigneeIds,
          label,
        }
      );

      const newProject: Project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const tasks: Models.DocumentList<Task> =
        await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
          Query.contains("projectId", projectId),
          Query.limit(5000),
        ]);

      for (const task of tasks.documents) {
        if (
          task.assigneeIds.some(
            (id: string): boolean => !newProject.assigneeIds.includes(id)
          )
        ) {
          await databases.updateDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            task.$id,
            {
              assigneeIds: task.assigneeIds.filter((id: string): boolean =>
                newProject.assigneeIds.includes(id)
              ),
            }
          );
        }
      }

      const existingDates: Models.DocumentList<ProjectDates> =
        await databases.listDocuments<ProjectDates>(DATABASE_ID, DATES_ID, [
          Query.equal("projectId", projectId),
        ]);

      const normalizeDate: (dateString: string) => string = (dateString) =>
        new Date(dateString).toISOString();

      const existingDateKeys = new Set(
        existingDates.documents.map(
          (date: ProjectDates): string =>
            `${date.title}-${normalizeDate(date.date)}`
        )
      );

      const newDateKeys = new Set(
        (dates || []).map(
          (date: DateItem): string => `${date.title}-${date.date.toISOString()}`
        )
      );

      const datesToDelete: ProjectDates[] = existingDates.documents.filter(
        (date: ProjectDates): boolean =>
          !newDateKeys.has(`${date.title}-${normalizeDate(date.date)}`)
      );

      const datesToAdd: ProjectDates[] = (dates || []).filter(
        (date: DateItem): boolean =>
          !existingDateKeys.has(`${date.title}-${date.date.toISOString()}`)
      );

      for (const dateDoc of datesToDelete) {
        await databases.deleteDocument(DATABASE_ID, DATES_ID, dateDoc.$id);
      }

      for (const date of datesToAdd) {
        await databases.createDocument(DATABASE_ID, DATES_ID, ID.unique(), {
          projectId,
          title: date.title,
          date: normalizeDate(date.date),
        });
      }

      return c.json({ data: project });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user: Models.User<Models.Preferences> = c.get("user");

    const { projectId } = c.req.param();

    const existingProject: Project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    if (!existingProject) {
      return c.json({ error: "Not found" }, 404);
    }

    const member: Member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projectDates: Models.DocumentList<ProjectDates> =
      await databases.listDocuments<ProjectDates>(DATABASE_ID, DATES_ID, [
        Query.equal("projectId", projectId),
        Query.limit(5000),
      ]);

    for (const date of projectDates.documents) {
      await databases.deleteDocument(DATABASE_ID, DATES_ID, date.$id);
    }

    const tasks: Models.DocumentList<Task> =
      await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        Query.limit(5000),
      ]);

    for (const task of tasks.documents) {
      await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);
    }

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({ data: { $id: existingProject.$id } });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user: Models.User<Models.Preferences> = c.get("user");

    const { projectId } = c.req.param();

    const project: Project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    if (!project) {
      return c.json({ error: "Not found" }, 404);
    }

    const member: Member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisWeekStart: Date = startOfWeek(now);
    const thisWeekEnd: Date = endOfWeek(now);
    const lastWeekStart: Date = startOfWeek(subWeeks(now, 1));
    const lastWeekEnd: Date = endOfWeek(subWeeks(now, 1));

    const getTasks: (
      queries: string[]
    ) => Promise<Models.DocumentList<Task>> = async (queries) => {
      return await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        queries
      );
    };

    const thisWeekTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
      Query.limit(5000),
    ]);

    const lastWeekTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
      Query.limit(5000),
    ]);

    const taskCount: number = thisWeekTasks.total;
    const taskDifference: number = taskCount - lastWeekTasks.total;

    const thisWeekAssignedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.contains("assigneeIds", member.$id),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
      Query.limit(5000),
    ]);

    const lastWeekAssignedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.contains("assigneeIds", member.$id),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
      Query.limit(5000),
    ]);

    const assignedTaskCount: number = thisWeekAssignedTasks.total;
    const assignedTaskDifference: number =
      assignedTaskCount - lastWeekAssignedTasks.total;

    const thisWeekIncompleteTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
      Query.limit(5000),
    ]);

    const lastWeekIncompleteTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
      Query.limit(5000),
    ]);

    const incompleteTaskCount: number = thisWeekIncompleteTasks.total;
    const incompleteTaskDifference: number =
      incompleteTaskCount - lastWeekIncompleteTasks.total;

    const thisWeekCompletedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
      Query.limit(5000),
    ]);

    const lastWeekCompletedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
      Query.limit(5000),
    ]);

    const completedTaskCount: number = thisWeekCompletedTasks.total;
    const completedTaskDifference: number =
      completedTaskCount - lastWeekCompletedTasks.total;

    const thisWeekOverdueTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", new Date().toISOString()),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
      Query.limit(5000),
    ]);

    const lastWeekOverdueTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", new Date().toISOString()),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
      Query.limit(5000),
    ]);

    const overdueTaskCount: number = thisWeekOverdueTasks.total;
    const overdueTaskDifference: number =
      overdueTaskCount - lastWeekOverdueTasks.total;

    return c.json({
      data: {
        assignedTaskCount,
        assignedTaskDifference,
        completedTaskCount,
        completedTaskDifference,
        incompleteTaskCount,
        incompleteTaskDifference,
        overdueTaskCount,
        overdueTaskDifference,
        taskCount,
        taskDifference,
      },
    });
  });

export default app;
