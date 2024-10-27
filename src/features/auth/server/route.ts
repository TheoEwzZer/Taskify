import { createAdminClient } from "@/lib/appwrite";
import { AdditionalContext, sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { ID, Models } from "node-appwrite";
import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../schemas";

const app = new Hono()
  .get(
    "/current",
    sessionMiddleware,
    async (
      c: Context<
        {
          Bindings: any;
          Variables: AdditionalContext["Variables"];
        },
        "/current",
        {}
      >
    ) => {
      const user: Models.User<Models.Preferences> = c.get("user");

      return c.json({ data: user });
    }
  )
  .post(
    "/login",
    zValidator("json", loginSchema),
    async (
      c: Context<
        {},
        "/login",
        {
          in: {
            json: {
              email: string;
              password: string;
            };
          };
          out: {
            json: {
              email: string;
              password: string;
            };
          };
        }
      >
    ) => {
      const { email, password } = c.req.valid("json");

      const { account } = await createAdminClient();

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ success: true });
    }
  )
  .post(
    "/register",
    zValidator("json", registerSchema),
    async (
      c: Context<
        {},
        "/register",
        {
          in: {
            json: {
              name: string;
              email: string;
              password: string;
            };
          };
          out: {
            json: {
              name: string;
              email: string;
              password: string;
            };
          };
        }
      >
    ) => {
      const { name, email, password } = c.req.valid("json");

      const { account } = await createAdminClient();

      await account.create(ID.unique(), email, password, name);

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ success: true });
    }
  )
  .post(
    "/logout",
    sessionMiddleware,
    async (
      c: Context<
        {
          Bindings: any;
          Variables: AdditionalContext["Variables"];
        },
        "/logout",
        {}
      >
    ) => {
      const account = c.get("account");

      deleteCookie(c, AUTH_COOKIE);
      await account.deleteSession("current");

      return c.json({ success: true });
    }
  );

export default app;
