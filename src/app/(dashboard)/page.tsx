import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { Workspace } from "@/features/workspaces/types";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";

export default async function Home(): Promise<ReactElement> {
  const user: Models.User<Models.Preferences> | null = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  const redirectUrl: RequestCookie | undefined = (await cookies()).get(
    "redirectUrl"
  );
  if (redirectUrl) {
    redirect(redirectUrl.value);
  }

  const workspaces: Models.DocumentList<Workspace> = await getWorkspaces();
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}
