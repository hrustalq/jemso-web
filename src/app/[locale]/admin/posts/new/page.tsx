import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { hasPermission } from "~/server/api/rbac";
import { db } from "~/server/db";
import { PostEditorForm } from "../_components/post-editor-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Создать новую статью | Администратор",
  description: "Создание новой статьи блога с помощью блочного редактора",
};

export default async function NewPostPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/admin/posts/new");
  }

  // Check if user has permission to create posts
  const canCreate = await hasPermission(
    db,
    session.user.id,
    "blog_post",
    "create"
  );

  if (!canCreate) {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Создать новую статью</h1>
        <p className="text-muted-foreground mt-2">
          Используйте блочный редактор для создания красивого структурированного контента
        </p>
      </div>

      <PostEditorForm mode="create" />
    </div>
  );
}

