import { PlanForm } from "../_components/plan-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Создать план | Администратор",
  description: "Создание нового тарифного плана",
};

export default function NewPlanPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Создать тарифный план
        </h1>
        <p className="mt-2 text-muted-foreground">
          Добавление нового тарифного плана с функциями и ценами
        </p>
      </div>

      <PlanForm />
    </div>
  );
}
