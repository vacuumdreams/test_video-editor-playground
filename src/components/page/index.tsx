"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

type PageProps = {
  children: ReactNode;
};

export const Page = ({ children }: PageProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <main className="container">{children}</main>
    </ThemeProvider>
  );
};
