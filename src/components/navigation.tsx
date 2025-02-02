"use client";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { LucideProps, SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, ReactElement, RefAttributes } from "react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { IconType } from "react-icons/lib";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

interface Route {
  label: string;
  href: string;
  icon:
    | IconType
    | ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >;
  activeIcon:
    | IconType
    | ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >;
}

const routes: Route[] = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation: () => ReactElement = () => {
  const workspaceId: string = useWorkspaceId();
  const pathname: string = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {routes.map((route: Route) => {
            const fullHref: string = `/workspaces/${workspaceId}${route.href}`;
            const isActive: boolean = pathname === fullHref;
            const Icon:
              | IconType
              | ForwardRefExoticComponent<
                  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
                > = isActive ? route.activeIcon : route.icon;

            return (
              <SidebarMenuItem
                key={route.label}
                className="rounded-md"
              >
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md py-2.5 font-medium text-neutral-500 transition hover:text-primary",
                    isActive &&
                      "bg-background text-primary shadow-xs hover:opacity-100"
                  )}
                >
                  <Link
                    key={route.href}
                    href={fullHref}
                  >
                    <Icon className="size-5 text-neutral-500" />
                    {route.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
