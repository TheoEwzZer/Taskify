"use client";

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { Projects } from "./projects";
import { WorkspaceSwitcher } from "./workspace-switcher";

export const Sidebar: () => ReactElement = () => {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState<string>("");

  useEffect((): void => {
    setLogoSrc(`/logo-${resolvedTheme === "dark" ? "dark" : "light"}.svg`);
  }, [resolvedTheme]);

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
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt="Logo"
              width={164}
              height={48}
              className="mx-auto"
            />
          ) : (
            <h1 className="text-center text-2xl font-bold">Taskify</h1>
          )}
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
