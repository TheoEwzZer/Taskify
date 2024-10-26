import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { ReactElement, ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: ({ children }: DashboardLayoutProps) => ReactElement = ({
  children,
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen">
      <SidebarProvider>
        <CreateWorkspaceModal />
        <CreateProjectModal />
        <CreateTaskModal />
        <EditTaskModal />
        <Sidebar />
        <SidebarInset>
          <main className="flex h-full w-full flex-col">
            <header className="flex h-[4.6rem] shrink-0 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 hidden h-12 lg:block"
              />
              <Navbar />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
