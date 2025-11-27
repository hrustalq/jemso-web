"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
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
import { Alert, AlertDescription } from "~/components/ui/alert";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const signUpMutation = api.auth.signUp.useMutation({
    onSuccess: async () => {
      setSuccess(true);
      
      // Auto sign in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

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

    signUpMutation.mutate({
      email,
      password,
      name: name || undefined,
    });
  };

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
              Аккаунт создан!
            </CardTitle>
            <CardDescription>
              Ваш аккаунт успешно создан. Перенаправление...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="flex min-h-(--content-height) items-center justify-center px-4 py-8"
      style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top) + 2rem)' }}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
          <CardDescription>
            Введите данные для создания нового аккаунта
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
              <Label htmlFor="name">Имя (Необязательно)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={signUpMutation.isPending}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={signUpMutation.isPending}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={signUpMutation.isPending}
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
                disabled={signUpMutation.isPending}
                className="h-11"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              className="w-full h-11"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? "Создание аккаунта..." : "Зарегистрироваться"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Link
                href="/auth/sign-in"
                className="text-primary font-medium hover:underline"
              >
                Войти
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

