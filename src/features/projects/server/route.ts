import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { Member } from "@/features/members/types";
import { getMember } from "@/features/members/util";
import { Task, TaskStatus } from "@/features/tasks/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { endOfWeek, startOfWeek, subWeeks } from "date-fns";
import { Hono } from "hono";
import { ID, Models, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { Project } from "../types";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user: Models.User<Models.Preferences> = c.get("user");

      const { name, image, workspaceId } = c.req.valid("form");

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

      const project: Project = await databases.createDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        }
      );

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

      const projects: Models.DocumentList<Project> =
        await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("$createdAt"),
        ]);

      return c.json({ data: projects });
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

    return c.json({ data: project });
  })
  .patch(
    "/:projectId",
    zValidator("form", updateProjectSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user: Models.User<Models.Preferences> = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

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
          imageUrl: uploadedImageUrl,
        }
      );

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

    const tasks: Models.DocumentList<Task> =
      await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
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
    ]);

    const lastWeekTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
    ]);

    const taskCount: number = thisWeekTasks.total;
    const taskDifference: number = taskCount - lastWeekTasks.total;

    const thisWeekAssignedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.equal("assigneeId", member.$id),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
    ]);

    const lastWeekAssignedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.equal("assigneeId", member.$id),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
    ]);

    const assignedTaskCount: number = thisWeekAssignedTasks.total;
    const assignedTaskDifference: number =
      assignedTaskCount - lastWeekAssignedTasks.total;

    const thisWeekIncompleteTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
    ]);

    const lastWeekIncompleteTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
    ]);

    const incompleteTaskCount: number = thisWeekIncompleteTasks.total;
    const incompleteTaskDifference: number =
      incompleteTaskCount - lastWeekIncompleteTasks.total;

    const thisWeekCompletedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisWeekEnd.toISOString()),
    ]);

    const lastWeekCompletedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastWeekStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastWeekEnd.toISOString()),
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
    ]);

    const lastWeekOverdueTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
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
