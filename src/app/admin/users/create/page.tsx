import { api } from "~/trpc/server";
import { CreateUserForm } from "./_components/create-user-form";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Создание пользователя | Админ-панель",
  description: "Создание нового пользователя",
};

export default async function CreateUserPage() {
  const [roles, plans] = await Promise.all([
    api.rbac.roles.list({ pageSize: 100 }),
    api.subscriptions.plans.list({ pageSize: 100, isActive: true })
  ]);

  // Serialize plans for client component
  const serializedPlans = plans.items.map(plan => ({
    ...plan,
    price: Number(plan.price)
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Создать пользователя</h1>
        <p className="mt-2 text-muted-foreground">
          Добавление нового пользователя в систему
        </p>
      </div>
      
      <div className="max-w-2xl">
        <CreateUserForm roles={roles.items} plans={serializedPlans} />
      </div>
    </div>
  );
}

