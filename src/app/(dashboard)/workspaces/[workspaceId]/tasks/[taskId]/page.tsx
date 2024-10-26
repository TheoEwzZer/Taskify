import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";
import { TaskIdClient } from "./client";

interface TaskIdPageProps {
  params: { taskId: string };
}

export default async function TaskIdPage({
  params,
}: Readonly<TaskIdPageProps>): Promise<ReactElement> {
  const user: Models.User<Models.Preferences> | null = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  // const initialValues: Task = await getTask({
  //   taskId: params.taskId,
  // });

  return (
    <div className="flex flex-col gap-y-4">
      <TaskIdClient />
    </div>
  );
}
