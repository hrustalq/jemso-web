import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { PlanForm } from "../../_components/plan-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактировать план | Администратор",
  description: "Редактирование деталей тарифного плана",
};

interface EditPlanPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlanPage({ params }: EditPlanPageProps) {
  const { id } = await params;

  const plan = await db.subscriptionPlan.findUnique({
    where: { id },
    include: {
      features: {
        include: {
          feature: true,
        },
      },
    },
  });

  if (!plan) {
    notFound();
  }

  // Transform the plan data to match PlanForm interface
  const planForForm = {
    ...plan,
    billingPeriod: plan.billingInterval,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Редактировать план</h1>
        <p className="mt-2 text-muted-foreground">
          Обновление деталей тарифного плана {plan.name}
        </p>
      </div>

      <PlanForm plan={planForForm} />
    </div>
  );
}
