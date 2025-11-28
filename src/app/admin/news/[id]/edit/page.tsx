import { redirect, notFound } from "next/navigation";
import { auth } from "~/server/auth";
import { hasPermission } from "~/server/api/rbac";
import { db } from "~/server/db";
import { NewsEditorForm } from "../../_components/news-editor-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактировать новость | Администратор",
  description: "Редактирование новости",
};

interface EditNewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect(`/auth/sign-in?callbackUrl=/admin/news/${id}/edit`);
  }

  // Fetch the news
  const news = await db.news.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
      category: true,
    },
  });

  if (!news) {
    notFound();
  }

  // Check if user owns the news or has permission to update
  const canUpdate = await hasPermission(
    db,
    session.user.id,
    "news",
    "update"
  );

  if (news.authorId !== session.user.id && !canUpdate) {
    redirect("/admin/news");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Редактировать новость</h1>
        <p className="text-muted-foreground mt-2">
          Обновите контент новости
        </p>
      </div>

      <NewsEditorForm mode="edit" news={news} />
    </div>
  );
}

