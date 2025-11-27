"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function SignOutPage() {
  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut({ 
          callbackUrl: "/",
          redirect: true 
        });
      } catch (error) {
        console.error("Sign out error:", error);
        // Fallback redirect in case of error
        void Promise.resolve().then(() => {
          window.location.href = "/";
        });
      }
    };

    void handleSignOut();
  }, []);

  return (
    <div 
      className="flex min-h-(--content-height) items-center justify-center px-4 py-8"
      style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top) + 2rem)' }}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">Выход из аккаунта</CardTitle>
          <CardDescription>
            Пожалуйста, подождите...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Выполняется выход из системы
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

