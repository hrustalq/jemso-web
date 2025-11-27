import { PlanForm } from "../_components/plan-form";

export const metadata = {
  title: "Create Plan | Admin",
  description: "Create a new subscription plan",
};

export default function NewPlanPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Create Subscription Plan
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add a new subscription plan with features and pricing
        </p>
      </div>

      <PlanForm />
    </div>
  );
}

