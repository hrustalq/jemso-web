"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminUpdateUserDto, type AdminUpdateUserDto } from "~/server/api/routers/user/dto/admin-update-user.dto";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

import { type RouterOutputs } from "~/trpc/react";

// Use a simplified type since we modify the user object
type User = Omit<RouterOutputs["user"]["getById"], "subscriptions"> & {
  subscriptions: (Omit<RouterOutputs["user"]["getById"]["subscriptions"][number], "plan"> & {
    plan: Omit<RouterOutputs["user"]["getById"]["subscriptions"][number]["plan"], "price"> & {
      price: number;
    };
  })[];
};

interface EditUserFormProps {
  user: User;
  roles: { id: string; name: string; slug: string }[];
  plans: { id: string; name: string; slug: string; price: number }[];
}

export function EditUserForm({ user, roles, plans }: EditUserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminUpdateUserDto>({
    resolver: zodResolver(adminUpdateUserDto),
    defaultValues: {
      id: user.id,
      name: user.name ?? "",
      email: user.email ?? "",
      roleIds: user.userRoles.map((ur) => ur.role.id),
      planId: user.subscriptions[0]?.planId, // Current active plan
    },
  });

  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      toast.success("Пользователь обновлен");
      router.refresh();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
      setIsSubmitting(false);
    },
  });

  function onSubmit(data: AdminUpdateUserDto) {
    setIsSubmitting(true);
    const updateData = { ...data };
    if (updateData.password === "") {
        delete updateData.password;
    }
    updateUser.mutate(updateData);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Данные пользователя</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый пароль</FormLabel>
                  <FormControl>
                    <Input placeholder="Оставьте пустым, чтобы не менять" type="password" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>
                    Минимум 8 символов. Оставьте пустым, если не хотите менять.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Роли</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {roles.map((role) => (
                  <FormField
                    key={role.id}
                    control={form.control}
                    name="roleIds"
                    render={({ field }) => {
                       const isChecked = field.value?.includes(role.id);
                      return (
                        <FormItem
                          key={role.id}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                        >
                          <FormControl>
                            <Switch
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                return checked
                                  ? field.onChange([...current, role.id])
                                  : field.onChange(
                                      current.filter(
                                        (value) => value !== role.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {role.name}
                            </FormLabel>
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="planId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>План подписки</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите план" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Изменение плана отменит текущую активную подписку и создаст новую.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

