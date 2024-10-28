import { IMAGES_BUCKET_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { editProfilSchema } from "../schemas";

const MAX_PREFS_SIZE: number = 64 * 1024; // 64kB

const app = new Hono().patch(
  "/",
  sessionMiddleware,
  zValidator("form", editProfilSchema.partial()),
  async (c) => {
    const { name, avatar } = c.req.valid("form");

    const account = c.get("account");
    const storage = c.get("storage");

    try {
      if (name) {
        await account.updateName(name);
      }
      if (avatar) {
        let uploadedImageUrl: string | undefined;
        if (avatar instanceof File) {
          const file = await storage.createFile(
            IMAGES_BUCKET_ID,
            ID.unique(),
            avatar
          );

          const arrayBuffer = await storage.getFilePreview(
            IMAGES_BUCKET_ID,
            file.$id
          );

          uploadedImageUrl = `data:avatar/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;

          if (uploadedImageUrl.length > MAX_PREFS_SIZE) {
            return c.json(
              { error: "Avatar image size exceeds the 64kB limit" },
              400
            );
          }
        } else {
          uploadedImageUrl = avatar;
        }

        await account.updatePrefs({
          avatar: uploadedImageUrl,
        });
      }

      return c.json({ success: true });
    } catch (error) {
      let errorMessage: string = "Failed to update user profile";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return c.json({ error: errorMessage }, 500);
    }
  }
);

export default app;
