import { UserButton } from "@/features/auth/components/user-button";
import { ReactElement } from "react";

export const Navbar: () => ReactElement = (): ReactElement => {
  return (
    <nav className="flex w-full items-center justify-end md:justify-between">
      <div className="hidden flex-col md:flex">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">
          Monitor all of your projects and tasks
        </p>
      </div>
      <UserButton />
    </nav>
  );
};
