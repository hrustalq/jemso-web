"use client";

import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "~/components/providers";
import type { ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Providers>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </Providers>
  );
}

