"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { EditProfilModal } from "@/features/profil/components/edit-profil-modal";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, ReactNode, useEffect, useState } from "react";

interface StandaloneLayoutProps {
  children: ReactNode;
}

const StandaloneLayout: ({
  children,
}: StandaloneLayoutProps) => ReactElement = ({
  children,
}: StandaloneLayoutProps) => {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState<string>("");

  useEffect((): void => {
    setLogoSrc(`/logo-${resolvedTheme === "dark" ? "dark" : "light"}.svg`);
  }, [resolvedTheme]);

  return (
    <main className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <EditProfilModal />
      <div className="mx-auto max-w-(--breakpoint-2xl) p-4">
        <nav className="flex h-[73px] items-center justify-between">
          <Link href="/">
            {logoSrc && (
              <Image
                src={logoSrc}
                alt="Logo"
                height={56}
                width={152}
              />
            )}
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
