import { FeatureForm } from "../_components/feature-form";

export const metadata = {
  title: "Create Feature | Admin",
  description: "Create a new subscription plan feature",
};

export default function NewFeaturePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Feature</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new feature that can be assigned to subscription plans
        </p>
      </div>

      <FeatureForm />
    </div>
  );
}

