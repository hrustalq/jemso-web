import { redirect } from "next/navigation";
import { PageWrapper } from "~/components/page-wrapper";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Suspense } from "react";
import { CheckoutForm } from "./_components/checkout-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CheckoutPageProps {
  searchParams: Promise<{ plan?: string }>;
}

// Loading skeleton for checkout
function CheckoutSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
      {/* Billing Form Skeleton */}
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-7 w-40 mt-6" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary Skeleton */}
      <div className="space-y-6">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-2 pt-4 border-t">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-12 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { plan } = await searchParams;

  if (!plan) {
    redirect("/pricing");
  }

  return (
    <PageWrapper>
      <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 lg:px-8">
        {/* Back link */}
        <Link 
          href="/pricing" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться к тарифам
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Оформление подписки</h1>
          <p className="mt-2 text-muted-foreground">
            Заполните данные для оформления подписки
          </p>
        </div>

        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutForm planId={plan} />
        </Suspense>
      </div>
    </PageWrapper>
  );
}

