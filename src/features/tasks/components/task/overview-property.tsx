import { ReactElement, ReactNode } from "react";

interface OverviewPropertyProps {
  label: string;
  children: ReactNode;
}

export const OverviewProperty: ({
  label,
  children,
}: OverviewPropertyProps) => ReactElement = ({ label, children }) => {
  return (
    <div className="flex items-start gap-x-2">
      <div className="min-w-[100px]">
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
      <div className="flex items-center gap-x-2">{children}</div>
    </div>
  );
};
