import { Providers } from "~/components/providers";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/checkout");
  }

  return (
    <Providers>
      {children}
    </Providers>
  );
}

