import { EventForm } from "../_components/event-form";

export const metadata = {
  title: "Create Event | Admin",
  description: "Create a new event",
};

export default function NewEventPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
        <p className="mt-2 text-muted-foreground">
          Create a new event with registration and payment management
        </p>
      </div>

      <EventForm />
    </div>
  );
}

