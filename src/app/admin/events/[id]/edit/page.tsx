import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { EventForm } from "../../_components/event-form";

export const metadata = {
  title: "Edit Event | Admin",
  description: "Edit event details",
};

interface EditEventPageProps {
  params: {
    id: string;
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const event = await db.event.findUnique({
    where: { id: params.id },
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
        <p className="mt-2 text-muted-foreground">
          Update event details and settings
        </p>
      </div>

      <EventForm event={event} />
    </div>
  );
}

