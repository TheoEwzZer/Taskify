"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: ({ children }: AuthLayoutProps) => ReactElement = ({
  children,
}: AuthLayoutProps) => {
  const pathname: string = usePathname();
  const isSignIn: boolean = pathname === "/sign-in";
  return (
    <main className="min-h-screen bg-neutral-900">
      <div className="mx-auto max-w-(--breakpoint-2xl) p-4">
        <nav className="flex items-center justify-between">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={152}
            height={56}
          />
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
