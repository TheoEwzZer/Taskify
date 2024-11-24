"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: ({ children }: AuthLayoutProps) => ReactElement = ({
  children,
}: AuthLayoutProps) => {
  const pathname: string = usePathname();
  const isSignIn: boolean = pathname === "/sign-in";
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState<string>("");

  useEffect((): void => {
    setLogoSrc(`/logo-${resolvedTheme === "dark" ? "dark" : "light"}.svg`);
  }, [resolvedTheme]);

  return (
    <main className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt="Logo"
              width={152}
              height={56}
            />
          ) : (
            <div />
          )}
          <Button
            asChild
            variant="secondary"
          >
            <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
              {isSignIn ? "Sign Up" : "Login"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 lg:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
