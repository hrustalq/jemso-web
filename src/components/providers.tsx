"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";
import { PermissionPromptsProvider } from "~/components/permission-prompts";
import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <TRPCReactProvider>
        <PermissionPromptsProvider
          initialDelay={5000}
          promptInterval={3000}
          excludedPaths={["/sign-in", "/sign-up", "/forgot-password", "/reset-password", "/admin"]}
          position="bottom-right"
        >
          {children}
        </PermissionPromptsProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}

