import { api } from "~/trpc/server";
import { EditUserForm } from "./_components/edit-user-form";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Редактирование пользователя | Админ-панель`,
  };
}

export default async function UserDetailsPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const [user, roles, plans] = await Promise.all([
      api.user.getById({ id }),
      api.rbac.roles.list({ pageSize: 100 }),
      api.subscriptions.plans.list({ pageSize: 100, isActive: true })
    ]);

    // Serialize user subscription and plans for client component
    const serializedUser = {
      ...user,
      subscriptions: user.subscriptions.map(sub => ({
        ...sub,
        plan: {
          ...sub.plan,
          price: Number(sub.plan.price)
        }
      }))
    };

    const serializedPlans = plans.items.map(plan => ({
      ...plan,
      price: Number(plan.price)
    }));

    return (
      <div className="space-y-6">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Редактирование пользователя</h1>
           <p className="mt-2 text-muted-foreground">
             ID: {user.id}
           </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Статистика</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Постов</p>
                            <p className="text-2xl font-bold">{user._count.blogPosts}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Комментариев</p>
                            <p className="text-2xl font-bold">{user._count.comments}</p>
                        </div>
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">Дата регистрации</p>
                            <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="md:col-span-2">
                <EditUserForm user={serializedUser} roles={roles.items} plans={serializedPlans} />
            </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

