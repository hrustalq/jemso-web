"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Trash2,
  Key,
} from "lucide-react";

export function SecuritySettings() {
  const changePassword = api.user.changePassword.useMutation();
  const deleteAccount = api.user.deleteAccount.useMutation();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Пароль должен содержать минимум 8 символов");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setPasswordError(
        "Пароль должен содержать заглавную букву, строчную букву и цифру"
      );
      return;
    }

    changePassword.mutate(
      {
        currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error) => {
          setPasswordError(error.message);
        },
      }
    );
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmDelete !== "DELETE") {
      return;
    }

    deleteAccount.mutate(
      { password: deletePassword },
      {
        onSuccess: () => {
          // Sign out and redirect
          void signOut();
        },
      }
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Change Password Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0">
            <Key className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-medium">Изменить пароль</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Обновите пароль для защиты вашего аккаунта
            </p>
          </div>
        </div>

        <Separator />

        {changePassword.isSuccess && (
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Пароль успешно изменен. Пожалуйста, войдите снова с новым паролем.
            </AlertDescription>
          </Alert>
        )}

        {passwordError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{passwordError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="currentPassword" className="text-sm">Текущий пароль</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={changePassword.isPending}
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="newPassword" className="text-sm">Новый пароль</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={changePassword.isPending}
              required
              className="text-sm"
            />
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              Минимум 8 символов, включая заглавную букву, строчную букву и цифру
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm">Подтвердите новый пароль</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={changePassword.isPending}
              required
              className="text-sm"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={changePassword.isPending} className="w-full sm:w-auto">
              {changePassword.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Обновление...
                </>
              ) : (
                "Обновить пароль"
              )}
            </Button>
          </div>
        </form>
      </div>

      <Separator className="my-6 sm:my-8" />

      {/* Delete Account Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="rounded-lg bg-destructive/10 p-2 sm:p-3 shrink-0">
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-medium">Удалить аккаунт</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Безвозвратно удалить ваш аккаунт и все связанные данные
            </p>
          </div>
        </div>

        <Separator />

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div>
            <AlertTitle className="text-sm sm:text-base">Предупреждение: Это действие необратимо</AlertTitle>
            <AlertDescription className="text-xs sm:text-sm">
              Удаление аккаунта навсегда удалит все ваши данные, включая статьи блога, 
              комментарии и подписки. Это действие нельзя отменить.
            </AlertDescription>
          </div>
        </Alert>

        {!showDeleteConfirm ? (
          <div className="flex justify-start">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить аккаунт
            </Button>
          </div>
        ) : (
          <form onSubmit={handleDeleteAccount} className="space-y-3 sm:space-y-4">
            {deleteAccount.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {deleteAccount.error.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="deletePassword" className="text-sm">
                Введите пароль для подтверждения
              </Label>
              <Input
                id="deletePassword"
                type="password"
                placeholder="••••••••"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                disabled={deleteAccount.isPending}
                required
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirmDelete" className="text-sm">
                Введите <strong>DELETE</strong> для подтверждения
              </Label>
              <Input
                id="confirmDelete"
                type="text"
                placeholder="DELETE"
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                disabled={deleteAccount.isPending}
                required
                className="text-sm"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword("");
                  setConfirmDelete("");
                  deleteAccount.reset();
                }}
                disabled={deleteAccount.isPending}
                className="w-full sm:w-auto"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={
                  confirmDelete !== "DELETE" || deleteAccount.isPending
                }
                className="w-full sm:w-auto"
              >
                {deleteAccount.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Удаление...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span className="truncate">Удалить аккаунт навсегда</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

