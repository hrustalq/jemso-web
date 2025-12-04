"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";
import { AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react";

export function ProfileSettings() {
  const { data: user, isLoading } = api.user.me.useQuery();
  const updateProfile = api.user.updateProfile.useMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form when data loads
  if (user && !hasChanges && !name && !email) {
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setImage(user.image ?? "");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updates: { name?: string; email?: string; image?: string | null } = {};

    if (name !== user?.name) updates.name = name;
    if (email !== user?.email) updates.email = email;
    if (image !== user?.image) updates.image = image || null;

    if (Object.keys(updates).length === 0) return;

    updateProfile.mutate(updates, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  const handleChange = () => {
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Не удалось загрузить данные пользователя</AlertDescription>
      </Alert>
    );
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Информация профиля</h3>
        <p className="text-sm text-muted-foreground">
          Обновите информацию вашего профиля
        </p>
      </div>

      <Separator />

      {updateProfile.isSuccess && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Профиль успешно обновлен</AlertDescription>
        </Alert>
      )}

      {updateProfile.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{updateProfile.error.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 shrink-0">
            <AvatarImage src={image ?? user.image} alt={user.name ?? ""} />
            <AvatarFallback className="text-base sm:text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="w-full space-y-2">
            <Label htmlFor="image" className="text-sm">URL изображения профиля</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  handleChange();
                }}
                disabled={updateProfile.isPending}
                className="text-sm"
              />
              <Button type="button" variant="outline" disabled className="shrink-0">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Введите URL изображения или загрузите фото (загрузка скоро будет доступна)
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Имя</Label>
          <Input
            id="name"
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleChange();
            }}
            disabled={updateProfile.isPending}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleChange();
            }}
            disabled={updateProfile.isPending}
          />
          {user.emailVerified && (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Подтвержден
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(user.emailVerified).toLocaleDateString('ru-RU')}
              </span>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="rounded-lg border border-border bg-muted/50 p-3 sm:p-4 space-y-2">
          <h4 className="text-sm font-medium">Информация об аккаунте</h4>
          <div className="grid gap-2 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
              <span className="text-muted-foreground">Аккаунт создан</span>
              <span>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
              <span className="text-muted-foreground">Роли</span>
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <Badge key={role.id} variant="outline" className="text-xs">
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setName(user.name ?? "");
              setEmail(user.email ?? "");
              setImage(user.image ?? "");
              setHasChanges(false);
              updateProfile.reset();
            }}
            disabled={!hasChanges || updateProfile.isPending}
            className="w-full sm:w-auto"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={!hasChanges || updateProfile.isPending}
            className="w-full sm:w-auto"
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              "Сохранить изменения"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

