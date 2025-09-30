// app/providers.tsx
"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/context/UserContext";


const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider attribute="class" defaultTheme="light"> */}
      <UserProvider>
        {children}
      </UserProvider>
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}
