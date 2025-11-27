import { FeatureForm } from "../_components/feature-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Создать функцию | Администратор",
  description: "Создание новой функции тарифного плана",
};

export default function NewFeaturePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Создать функцию</h1>
        <p className="mt-2 text-muted-foreground">
          Добавление новой функции которая может быть назначена тарифным планам
        </p>
      </div>

      <FeatureForm />
    </div>
  );
}
