"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

const pathnameMap = {
  tasks: {
    title: "Tasks",
    description: "View all of your tasks here",
  },
  projects: {
    title: "Projects",
    description: "View all of your projects here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks",
};

export const Navbar: () => ReactElement = () => {
  const pathname: string = usePathname();
  const pathnameParts: string[] = pathname.split("/");
  const pathnameKey: "tasks" | "projects" =
    pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="flex w-full items-center justify-end lg:justify-between">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <UserButton />
    </nav>
  );
};
