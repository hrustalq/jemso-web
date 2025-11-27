import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { CategoryForm } from "../../_components/category-form";

export const metadata = {
  title: "Edit Category | Admin",
  description: "Edit category details",
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
        <p className="mt-2 text-muted-foreground">
          Update category details and information
        </p>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}

