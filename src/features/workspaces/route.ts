import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Models, Query } from "node-appwrite";
import { z } from "zod";
import { MemberRole } from "../members/type";
import { getMember } from "../members/util";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user: Models.User<Models.Preferences> = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member: Models.Document = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const members: Models.DocumentList<Models.Document> =
        await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", workspaceId),
        ]);

      const populatedMembers: Array<
        Models.Document & {
          name: string;
          email: string;
        }
      > = await Promise.all(
        members.documents.map(async (member: Models.Document) => {
          const user: Models.User<Models.Preferences> = await users.get(
            member.userId
          );
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      return c.json({
        data: {
          ...member,
          documents: populatedMembers,
        },
      });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user: Models.User<Models.Preferences> = c.get("user");
    const databases = c.get("databases");

    const memberToDelete: Models.Document = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    if (!memberToDelete) {
      return c.json({ error: "Not found" }, 404);
    }

    const allMembersInWorkspace: Models.DocumentList<Models.Document> =
      await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", memberToDelete.workspaceId),
      ]);

    const member: Models.Document = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (
      member.$id !== memberToDelete.userId &&
      member.role !== MemberRole.ADMIN
    ) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (allMembersInWorkspace.documents.length === 1) {
      return c.json({ error: "Cannot delete the last member" }, 400);
    }
    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: { $id: memberToDelete.$id } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user: Models.User<Models.Preferences> = c.get("user");
      const databases = c.get("databases");

      const memberToUpdate: Models.Document = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      if (!memberToUpdate) {
        return c.json({ error: "Not found" }, 404);
      }

      const allMembersInWorkspace: Models.DocumentList<Models.Document> =
        await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", memberToUpdate.workspaceId),
        ]);

      const member: Models.Document = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (allMembersInWorkspace.documents.length === 1) {
        return c.json({ error: "Cannot downgrade the last member" }, 400);
      }
      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );

export default app;
