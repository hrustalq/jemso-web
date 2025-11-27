import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { hasRole } from "~/server/api/rbac";
import { db } from "~/server/db";
import { AdminLayoutClient } from "./_components/admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/admin");
  }

  // Check if user has admin or content_manager role
  const [isAdmin, isContentManager] = await Promise.all([
    hasRole(db, session.user.id, "admin"),
    hasRole(db, session.user.id, "content_manager"),
  ]);

  if (!isAdmin && !isContentManager) {
    redirect("/");
  }

  return (
    <AdminLayoutClient
      userName={session.user.name ?? null}
      userEmail={session.user.email ?? null}
    >
      {children}
    </AdminLayoutClient>
  );
}
