import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { FeatureForm } from "../../_components/feature-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактировать функцию | Администратор",
  description: "Редактирование деталей функции",
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
        <h1 className="text-3xl font-bold tracking-tight">Редактировать функцию</h1>
        <p className="mt-2 text-muted-foreground">
          Обновление деталей функции {feature.name}
        </p>
        {feature._count.planFeatures > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            Используется в {feature._count.planFeatures} планах
          </p>
        )}
      </div>

      <FeatureForm feature={feature} />
    </div>
  );
}
