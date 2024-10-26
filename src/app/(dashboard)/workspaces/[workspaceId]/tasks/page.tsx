import { getCurrent } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";

const TasksPage: () => Promise<ReactElement> = async () => {
  const user: Models.User<Models.Preferences> | null = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div className="flex h-full flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
