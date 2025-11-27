import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { hasPermission } from "~/server/api/rbac";
import { db } from "~/server/db";
import { PostEditorForm } from "../_components/post-editor-form";

export const metadata = {
  title: "Create New Post | Admin",
  description: "Create a new blog post with the block editor",
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
        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
        <p className="text-muted-foreground mt-2">
          Use the block editor to create beautiful, structured content
        </p>
      </div>

      <PostEditorForm mode="create" />
    </div>
  );
}

