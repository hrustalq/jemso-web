import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { FeatureForm } from "../../_components/feature-form";

export const metadata = {
  title: "Edit Feature | Admin",
  description: "Edit feature details",
};

interface EditFeaturePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFeaturePage({
  params,
}: EditFeaturePageProps) {
  const { id } = await params;

  const feature = await db.feature.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          planFeatures: true,
        },
      },
    },
  });

  if (!feature) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Feature</h1>
        <p className="mt-2 text-muted-foreground">
          Update {feature.name} feature details
        </p>
        {feature._count.planFeatures > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            Used in {feature._count.planFeatures} plan(s)
          </p>
        )}
      </div>

      <FeatureForm feature={feature} />
    </div>
  );
}

