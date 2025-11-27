"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const verifyTokenQuery = api.auth.verifyResetToken.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const resetPasswordMutation = api.auth.resetPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 3000);
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  useEffect(() => {
    if (!token) {
      setFormError("Недействительный или отсутствующий токен сброса");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Пароли не совпадают");
      return;
    }

    if (password.length < 8) {
      setFormError("Пароль должен содержать минимум 8 символов");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setFormError(
        "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру"
      );
      return;
    }

    if (!token) {
      setFormError("Недействительный токен сброса");
      return;
    }

    resetPasswordMutation.mutate({ token, password });
  };

  // Loading state while verifying token
  if (verifyTokenQuery.isLoading) {
    return (
      <div 
        className="flex min-h-(--content-height) items-center justify-center px-4 py-8"
        style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top) + 2rem)' }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Проверка токена...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid or expired token
  if (!token || verifyTokenQuery.data?.valid === false) {
    return (
      <div 
        className="flex min-h-(--content-height) items-center justify-center px-4 py-8"
        style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top) + 2rem)' }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-destructive">
              <AlertCircle className="h-6 w-6" />
              Недействительная ссылка
            </CardTitle>
            <CardDescription>
              Эта ссылка для сброса пароля недействительна или истекла
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ссылка истекла или недействительна</AlertTitle>
              <AlertDescription>
                Ссылки для сброса пароля действительны в течение 1 часа. Пожалуйста, запросите новую.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-2">
            <Link href="/auth/forgot-password" className="w-full">
              <Button className="w-full h-11">Запросить новую ссылку</Button>
            </Link>
            <Link href="/auth/sign-in" className="w-full">
              <Button variant="outline" className="w-full h-11">
                Вернуться к входу
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div 
        className="flex min-h-(--content-height) items-center justify-center px-4 py-8"
        style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top) + 2rem)' }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-green-600">
              <CheckCircle2 className="h-6 w-6" />
              Пароль успешно изменён
            </CardTitle>
            <CardDescription>
              Ваш пароль был успешно изменён
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Успешно!</AlertTitle>
              <AlertDescription>
                Теперь вы можете войти с новым паролем. Перенаправление на страницу входа...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Reset password form
  return (
    <div 
      className="flex min-h-(--content-height) items-center justify-center px-4 py-8"
      style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top) + 2rem)' }}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">Сброс пароля</CardTitle>
          <CardDescription>
            Введите новый пароль для {verifyTokenQuery.data?.email}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Новый пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={resetPasswordMutation.isPending}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Минимум 8 символов, включая заглавную букву, строчную букву и цифру
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={resetPasswordMutation.isPending}
                className="h-11"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              className="w-full h-11"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending
                ? "Сброс пароля..."
                : "Сбросить пароль"}
            </Button>

            <Link href="/auth/sign-in" className="w-full">
              <Button
                variant="outline"
                className="w-full h-11"
                type="button"
                disabled={resetPasswordMutation.isPending}
              >
                Отмена
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

