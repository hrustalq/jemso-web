import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/dashboard/settings/profile");
  }

  // Redirect to new user space settings
  redirect("/dashboard/settings/profile");
}
