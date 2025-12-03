import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { EventForm } from "../../_components/event-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактировать событие | Администратор",
  description: "Редактирование деталей события",
};

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await db.event.findUnique({
    where: { id },
    include: {
      category: true,
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Редактировать событие</h1>
        <p className="mt-2 text-muted-foreground">
          Обновление деталей и настроек события
        </p>
      </div>

      <EventForm event={event} />
    </div>
  );
}

