import { EventForm } from "../_components/event-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Создать событие | Администратор",
  description: "Создание нового события",
};

export default function NewEventPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Создать событие</h1>
        <p className="mt-2 text-muted-foreground">
          Создание нового события с управлением регистрацией и оплатой
        </p>
      </div>

      <EventForm />
    </div>
  );
}

