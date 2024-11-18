import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { Member, MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/util";
import { Task, TaskStatus } from "@/features/tasks/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { endOfWeek, startOfWeek, subWeeks } from "date-fns";
import { Hono } from "hono";
import { ID, Models, Query } from "node-appwrite";
import { z } from "zod";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { Workspace } from "../types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user: Models.User<Models.Preferences> = c.get("user");
    const databases = c.get("databases");

    const members: Models.DocumentList<Member> =
      await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
        Query.equal("userId", user.$id),
      ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspacesIds: string[] = members.documents.map(
      (member: Member): string => member.workspaceId
    );

    const workspaces: Models.DocumentList<Workspace> =
      await databases.listDocuments<Workspace>(DATABASE_ID, WORKSPACES_ID, [
        Query.orderDesc("$createdAt"),
        Query.contains("$id", workspacesIds),
      ]);

    return c.json({ data: workspaces });
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    const databases = c.get("databases");
    const user: Models.User<Models.Preferences> = c.get("user");

    const member: Member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace: Workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (!workspace) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data: workspace });
  })
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    const databases = c.get("databases");

    const workspace: Workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (!workspace) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data: { name: workspace.name } });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user: Models.User<Models.Preferences> = c.get("user");

      const { name, image } = c.req.valid("form");

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

      const workspace: Workspace = await databases.createDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(6),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user: Models.User<Models.Preferences> = c.get("user");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member: Member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
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

      const workspace: Workspace = await databases.updateDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user: Models.User<Models.Preferences> = c.get("user");

    const { workspaceId } = c.req.param();

    const member: Member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        { error: "Unauthorized beacuse you are not an admin" },
        401
      );
    }

    const tasks: Models.DocumentList<Task> =
      await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

    for (const task of tasks.documents) {
      await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);
    }

    const members: Models.DocumentList<Member> =
      await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

    for (const member of members.documents) {
      await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, member.$id);
    }

    const projects: Models.DocumentList<Workspace> =
      await databases.listDocuments<Workspace>(DATABASE_ID, WORKSPACES_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

    for (const project of projects.documents) {
      await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, project.$id);
    }

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user: Models.User<Models.Preferences> = c.get("user");

    const { workspaceId } = c.req.param();

    const member: Member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace: Workspace = await databases.updateDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(6),
      }
    );

    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    zValidator("json", z.object({ code: z.string() })),
    sessionMiddleware,
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user: Models.User<Models.Preferences> = c.get("user");

      const member: Member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) {
        return c.json({ error: "Already a member" }, 400);
      }

      const workspace: Workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (!workspace) {
        return c.json({ error: "Not found" }, 404);
      }

      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId,
        role: MemberRole.MEMBER,
      });

      return c.json({ data: workspace });
    }
  )
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user: Models.User<Models.Preferences> = c.get("user");

    const { workspaceId } = c.req.param();

    const member: Member = await getMember({
      databases,
      workspaceId: workspaceId,
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
      Query.equal("workspaceId", workspaceId),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
    ]);

    const lastWeekTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("workspaceId", workspaceId),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
    ]);

    const taskCount: number = thisWeekTasks.total;
    const taskDifference: number = taskCount - lastWeekTasks.total;

    const thisWeekAssignedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("workspaceId", workspaceId),
      Query.contains("assigneeIds", member.$id),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
    ]);

    const lastWeekAssignedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("workspaceId", workspaceId),
      Query.contains("assigneeIds", member.$id),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
    ]);

    const assignedTaskCount: number = thisWeekAssignedTasks.total;
    const assignedTaskDifference: number =
      assignedTaskCount - lastWeekAssignedTasks.total;

    const thisWeekIncompleteTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
    ]);

    const lastWeekIncompleteTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
    ]);

    const incompleteTaskCount: number = thisWeekIncompleteTasks.total;
    const incompleteTaskDifference: number =
      incompleteTaskCount - lastWeekIncompleteTasks.total;

    const thisWeekCompletedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("workspaceId", workspaceId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
    ]);

    const lastWeekCompletedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("workspaceId", workspaceId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
    ]);

    const completedTaskCount: number = thisWeekCompletedTasks.total;
    const completedTaskDifference: number =
      completedTaskCount - lastWeekCompletedTasks.total;

    const thisWeekOverdueTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", new Date().toISOString()),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
    ]);

    const lastWeekOverdueTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", new Date().toISOString()),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
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
