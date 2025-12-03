import { redirect, notFound } from "next/navigation";
import { auth } from "~/server/auth";
import { hasPermission } from "~/server/api/rbac";
import { db } from "~/server/db";
import { PostEditorForm } from "../../_components/post-editor-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактировать статью | Администратор",
  description: "Редактирование статьи блога с помощью блочного редактора",
};

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect(`/auth/sign-in?callbackUrl=/admin/posts/${id}/edit`);
  }

  // Fetch the post
  const post = await db.blogPost.findUnique({
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

  if (!post) {
    notFound();
  }

  // Check if user owns the post or has permission to update
  const canUpdate = await hasPermission(
    db,
    session.user.id,
    "blog_post",
    "update"
  );

  if (post.authorId !== session.user.id && !canUpdate) {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Редактировать статью</h1>
        <p className="text-muted-foreground mt-2">
          Обновите ваш контент с помощью блочного редактора
        </p>
      </div>

      <PostEditorForm mode="edit" post={post} />
    </div>
  );
}

