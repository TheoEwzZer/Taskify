import "server-only";

import { AUTH_COOKIE } from "@/features/auth/constants";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { Account, Client, Databases, Users } from "node-appwrite";

export async function createSessionClient(): Promise<{
  readonly account: Account;
  readonly databases: Databases;
}> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session: RequestCookie | undefined = (await cookies()).get(AUTH_COOKIE);

  if (!session?.value) {
    throw new Error("Unauthorized");
  }

  client.setSession(session.value);

  return {
    get account(): Account {
      return new Account(client);
    },
    get databases(): Databases {
      return new Databases(client);
    },
  };
}

export async function createAdminClient(): Promise<{
  readonly account: Account;
  readonly users: Users;
}> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APP_APPWRITE_KEY!);

  return {
    get account(): Account {
      return new Account(client);
    },
    get users(): Users {
      return new Users(client);
    },
  };
}
