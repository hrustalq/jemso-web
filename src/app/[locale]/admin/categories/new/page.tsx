import { CategoryForm } from "../_components/category-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Создать категорию | Администратор",
  description: "Создание новой категории",
};

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Создать категорию</h1>
        <p className="mt-2 text-muted-foreground">
          Добавление новой категории для статей блога и событий
        </p>
      </div>

      <CategoryForm />
    </div>
  );
}
