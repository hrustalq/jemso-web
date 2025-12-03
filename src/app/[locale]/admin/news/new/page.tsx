import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { hasPermission } from "~/server/api/rbac";
import { db } from "~/server/db";
import { NewsEditorForm } from "../_components/news-editor-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Создать новость | Администратор",
  description: "Создание новой новости",
};

export default async function NewNewsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/admin/news/new");
  }

  // Check if user has permission to create news
  const canCreate = await hasPermission(
    db,
    session.user.id,
    "news",
    "create"
  );

  if (!canCreate) {
    redirect("/admin/news");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Создать новость</h1>
        <p className="text-muted-foreground mt-2">
          Создайте новую новость используя редактор
        </p>
      </div>

      <NewsEditorForm mode="create" />
    </div>
  );
}

