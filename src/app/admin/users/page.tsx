import { db } from "~/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { UserActions } from "./_components/user-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Управление пользователями | Администратор",
  description: "Управление пользователями системы и их ролями",
};

export default async function UsersPage() {
  const users = await db.user.findMany({
    include: {
      userRoles: {
        where: {
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        include: {
          role: true,
        },
      },
      _count: {
        select: {
          blogPosts: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Пользователи</h1>
        <p className="mt-2 text-muted-foreground">
          Управление пользователями и их ролями
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Все пользователи ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роли</TableHead>
                <TableHead>Статьи</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Пользователи не найдены
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name ?? "—"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.userRoles.length > 0 ? (
                          user.userRoles.map((ur) => (
                            <Badge key={ur.id} variant="secondary">
                              {ur.role.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Нет ролей
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user._count.blogPosts}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell className="text-right">
                      <UserActions userId={user.id} userEmail={user.email ?? ""} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

