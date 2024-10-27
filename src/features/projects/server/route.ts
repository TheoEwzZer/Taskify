import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { Member } from "@/features/members/types";
import { getMember } from "@/features/members/util";
import { Task, TaskStatus } from "@/features/tasks/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
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
    const thisMonthStart: Date = startOfMonth(now);
    const thisMonthEnd: Date = endOfMonth(now);
    const lastMonthStart: Date = startOfMonth(subMonths(now, 1));
    const lastMonthEnd: Date = endOfMonth(subMonths(now, 1));

    const getTasks: (
      queries: string[]
    ) => Promise<Models.DocumentList<Task>> = async (queries) => {
      return await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        queries
      );
    };

    const thisMonthTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);

    const lastMonthTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const taskCount: number = thisMonthTasks.total;
    const taskDifference: number = taskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.equal("assigneeId", user.$id),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);

    const lastMonthAssignedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.equal("assigneeId", user.$id),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const assignedTaskCount: number = thisMonthAssignedTasks.total;
    const assignedTaskDifference: number =
      assignedTaskCount - lastMonthAssignedTasks.total;

    const thisMonthIncompleteTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);

    const lastMonthIncompleteTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const incompleteTaskCount: number = thisMonthIncompleteTasks.total;
    const incompleteTaskDifference: number =
      incompleteTaskCount - lastMonthIncompleteTasks.total;

    const thisMonthCompletedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);

    const lastMonthCompletedTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const completedTaskCount: number = thisMonthCompletedTasks.total;
    const completedTaskDifference: number =
      completedTaskCount - lastMonthCompletedTasks.total;

    const thisMonthOverdueTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", new Date().toISOString()),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);

    const lastMonthOverdueTasks: Models.DocumentList<Task> = await getTasks([
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", new Date().toISOString()),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const overdueTaskCount: number = thisMonthOverdueTasks.total;
    const overdueTaskDifference: number =
      overdueTaskCount - lastMonthOverdueTasks.total;

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
