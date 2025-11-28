"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";

// Dynamically import EventForm to avoid SSR issues with CKEditor
const EventForm = dynamic(
  () => import("~/app/admin/events/_components/event-form").then((mod) => ({ default: mod.EventForm })),
  { ssr: false }
);

export default function CreateEventPage() {
  const router = useRouter();

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Создать новое событие</h1>
        <p className="mt-2 text-muted-foreground">
          Отправьте событие на модерацию.
        </p>
      </div>

      <EventForm 
        onSuccess={() => {
          toast.success("Событие успешно отправлено!", {
            description: "Событие успешно отправлено!",
          });
          router.push("/events");
        }}
      />
    </div>
  );
}

