import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { PlanForm } from "../../_components/plan-form";

export const metadata = {
  title: "Edit Plan | Admin",
  description: "Edit subscription plan details",
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Plan</h1>
        <p className="mt-2 text-muted-foreground">
          Update {plan.name} subscription plan details
        </p>
      </div>

      <PlanForm plan={plan} />
    </div>
  );
}

