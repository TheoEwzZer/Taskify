import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";

export default async function Home(): Promise<ReactElement> {
  const user: Models.User<Models.Preferences> | null = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  const workspaces: Models.DocumentList<Models.Document> =
    await getWorkspaces();
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}
