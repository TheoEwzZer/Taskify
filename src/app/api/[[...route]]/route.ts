import auth from "@/features/auth/server/route";
import projects from "@/features/projects/server/route";
import tasks from "@/features/tasks/server/route";
import members from "@/features/workspaces/route";
import workspaces from "@/features/workspaces/server/route";

import { Hono } from "hono";
import { BlankEnv, BlankSchema, FetchEventLike } from "hono/types";
import { handle } from "hono/vercel";

const app: Hono<BlankEnv, BlankSchema, "/api"> = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/workspaces", workspaces)
  .route("/members", members)
  .route("/projects", projects)
  .route("/tasks", tasks);

export const GET: (
  req: Request,
  requestContext: FetchEventLike
) => Response | Promise<Response> = handle(app);
export const POST: (
  req: Request,
  requestContext: FetchEventLike
) => Response | Promise<Response> = handle(app);
export const PATCH: (
  req: Request,
  requestContext: FetchEventLike
) => Response | Promise<Response> = handle(app);
export const DELETE: (
  req: Request,
  requestContext: FetchEventLike
) => Response | Promise<Response> = handle(app);

export type AppType = typeof routes;
