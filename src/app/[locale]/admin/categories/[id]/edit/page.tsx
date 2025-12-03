import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { CategoryForm } from "../../_components/category-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактировать категорию | Администратор",
  description: "Редактирование деталей категории",
};

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const category = await db.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Редактировать категорию</h1>
        <p className="mt-2 text-muted-foreground">
          Обновление деталей и информации категории
        </p>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
