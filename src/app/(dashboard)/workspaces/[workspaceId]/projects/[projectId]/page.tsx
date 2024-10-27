import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";
import { ProjectIdClient } from "./client";

export default async function ProjectIdPage(): Promise<ReactElement> {
  const user: Models.User<Models.Preferences> | null = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  return <ProjectIdClient />;
}
