import { UserButton } from "@/features/auth/components/user-button";
import { EditProfilModal } from "@/features/profil/components/edit-profil-modal";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, ReactNode } from "react";

interface StandaloneLayoutProps {
  children: ReactNode;
}

const StandaloneLayout: ({
  children,
}: StandaloneLayoutProps) => ReactElement = ({
  children,
}: StandaloneLayoutProps) => {
  return (
    <main className="min-h-screen bg-neutral-100">
      <EditProfilModal />
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex h-[73px] items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              height={56}
              width={152}
            />
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
