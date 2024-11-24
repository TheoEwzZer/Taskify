import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";
import { TaskIdClient } from "./client";

export default async function TaskIdPage(): Promise<ReactElement> {
  const user: Models.User<Models.Preferences> | null = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-y-4">
      <TaskIdClient />
    </div>
  );
}
