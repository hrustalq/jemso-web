import { redirect, notFound } from "next/navigation";
import { auth } from "~/server/auth";
import { hasPermission } from "~/server/api/rbac";
import { db } from "~/server/db";
import { PostEditorForm } from "../../_components/post-editor-form";

export const metadata = {
  title: "Edit Post | Admin",
  description: "Edit blog post with the block editor",
};

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await auth();

  if (!session) {
    redirect(`/auth/sign-in?callbackUrl=/admin/posts/${params.id}/edit`);
  }

  // Fetch the post
  const post = await db.blogPost.findUnique({
    where: { id: params.id },
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground mt-2">
          Update your content using the block editor
        </p>
      </div>

      <PostEditorForm mode="edit" post={post} />
    </div>
  );
}

