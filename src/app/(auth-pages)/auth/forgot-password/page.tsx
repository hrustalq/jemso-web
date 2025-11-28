"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { PageWrapper } from "~/components/page-wrapper";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const forgotPasswordMutation = api.auth.forgotPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate({ email });
  };

  if (success) {
    return (
      <PageWrapper 
        className="flex items-center justify-center bg-background px-4 py-8"
        style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top) + 2rem)' }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Проверьте email
            </CardTitle>
            <CardDescription>
              Мы отправили инструкции по восстановлению пароля на {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Email успешно отправлен</AlertTitle>
              <AlertDescription>
                Если аккаунт с таким email существует, вы получите ссылку для сброса пароля в ближайшее время. Ссылка действительна в течение 1 часа.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Link href="/auth/sign-in" className="w-full">
              <Button variant="outline" className="w-full h-11">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к входу
              </Button>
            </Link>
            <div className="text-center text-sm text-muted-foreground">
              Не получили email?{" "}
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  forgotPasswordMutation.reset();
                }}
                className="text-primary font-medium hover:underline"
              >
                Попробовать снова
              </button>
            </div>
          </CardFooter>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      className="flex items-center justify-center px-4 py-8"
      style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top) + 2rem)' }}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">Забыли пароль?</CardTitle>
          <CardDescription>
            Введите email и мы отправим вам ссылку для восстановления пароля
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {forgotPasswordMutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {forgotPasswordMutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={forgotPasswordMutation.isPending}
                className="h-11"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              className="w-full h-11"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending
                ? "Отправка..."
                : "Отправить ссылку"}
            </Button>

            <Link href="/auth/sign-in" className="w-full">
              <Button variant="outline" className="w-full h-11">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к входу
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </PageWrapper>
  );
}

