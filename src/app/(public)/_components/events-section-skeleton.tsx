import { EventSkeleton } from "~/components/event-skeleton";

export function EventsSectionSkeleton() {
  return (
    <section className="snap-start flex items-center justify-center py-16" style={{ minHeight: 'calc(100vh - var(--header-height) - var(--safe-top))' }}>
      <div className="container mx-auto px-4 w-full">
        <div className="mb-12">
          <div className="mb-4 h-10 w-64 animate-pulse rounded-lg bg-muted" />
        </div>

        <EventSkeleton />
      </div>
    </section>
  );
}

