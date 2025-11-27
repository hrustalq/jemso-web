import { CategoryForm } from "../_components/category-form";

export const metadata = {
  title: "Create Category | Admin",
  description: "Create a new category",
};

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Category</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new category for blog posts and events
        </p>
      </div>

      <CategoryForm />
    </div>
  );
}

