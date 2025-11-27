import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Users, FileText, CreditCard, Star, Calendar, Folder } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Панель управления | Администратор",
  description: "Обзор панели администратора",
};

export default async function AdminDashboard() {
  const session = await auth();

  // Fetch stats
  const [
    usersCount,
    postsCount,
    eventsCount,
    categoriesCount,
    subscriptionsCount,
    plansCount,
    featuresCount,
  ] = await Promise.all([
    db.user.count(),
    db.blogPost.count(),
    db.event.count(),
    db.category.count(),
    db.userSubscription.count({
      where: { status: "active" },
    }),
    db.subscriptionPlan.count(),
    db.feature.count(),
  ]);

  const stats = [
    {
      title: "Всего пользователей",
      value: usersCount,
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Статей блога",
      value: postsCount,
      icon: FileText,
      href: "/admin/posts",
    },
    {
      title: "События",
      value: eventsCount,
      icon: Calendar,
      href: "/admin/events",
    },
    {
      title: "Категории",
      value: categoriesCount,
      icon: Folder,
      href: "/admin/categories",
    },
    {
      title: "Активные подписки",
      value: subscriptionsCount,
      icon: CreditCard,
      href: "/admin/plans",
    },
    {
      title: "Тарифные планы",
      value: plansCount,
      icon: CreditCard,
      href: "/admin/plans",
    },
    {
      title: "Функции",
      value: featuresCount,
      icon: Star,
      href: "/admin/features",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
        <p className="mt-2 text-muted-foreground">
          С возвращением, {session?.user.name ?? "Администратор"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Последняя активность</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Лента активности скоро будет доступна...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

