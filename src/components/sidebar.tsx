"use client";

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { ReactElement } from "react";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { Projects } from "./projects";
import { WorkspaceSwitcher } from "./workspace-switcher";

export const Sidebar: () => ReactElement = () => {
  return (
    <SidebarComponent
      variant="inset"
      collapsible="offcanvas"
    >
      <SidebarHeader>
        <Link
          href="/"
          className="py-2"
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={164}
            height={48}
            className="mx-auto"
          />
        </Link>
        <DottedSeparator className="px-2" />
        <WorkspaceSwitcher />
      </SidebarHeader>
      <DottedSeparator className="px-2 pb-2" />
      <SidebarContent>
        <Navigation />
        <DottedSeparator className="px-2" />
        <Projects />
      </SidebarContent>
    </SidebarComponent>
  );
};
