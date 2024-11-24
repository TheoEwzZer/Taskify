"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps, ReactElement } from "react";

export function ThemeProvider({
  children,
  ...props
}: Readonly<ComponentProps<typeof NextThemesProvider>>): ReactElement {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
