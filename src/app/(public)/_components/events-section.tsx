import { api } from "~/trpc/server";
import { AnimatedSectionHeader } from "~/components/animated-section-header";
import { AnimatedEventCard } from "~/components/animated-event-card";
import { ScrollReveal } from "~/components/scroll-reveal";
import { SectionMeshBackground } from "~/components/section-mesh-background";

export async function EventsSection() {
  // Fetch both upcoming and past events in parallel
  const [upcomingEvents, pastEvents] = await Promise.all([
    api.event.events.list({
      page: 1,
      pageSize: 3,
      published: true,
      upcoming: true,
    }),
    api.event.events.list({
      page: 1,
      pageSize: 3,
      published: true,
      past: true,
    }),
  ]);

  // Serialize Decimal to number for client components
  const serializedUpcomingEvents = upcomingEvents.items.map((event) => ({
    ...event,
    price: event.price.toNumber(),
  }));

  const serializedPastEvents = pastEvents.items.map((event) => ({
    ...event,
    price: event.price.toNumber(),
  }));

  const hasEvents = serializedUpcomingEvents.length > 0 || serializedPastEvents.length > 0;

  return (
    <section className="snap-start flex items-center justify-center py-8 sm:py-12 md:py-16 relative section-min-h-full">
      <SectionMeshBackground variant="purple" intensity="low" />
      <div className="container mx-auto px-3 sm:px-4 w-full relative z-10">
        <ScrollReveal animation="slideInLeft">
          <AnimatedSectionHeader
            title="Мероприятия"
            linkText="Все события"
            linkHref="/events"
          />
        </ScrollReveal>

        {!hasEvents ? (
          <div className="rounded-lg border border-border/40 bg-card/50 p-8 sm:p-12 text-center backdrop-blur">
            <p className="text-base sm:text-lg text-muted-foreground">
              События пока не запланированы. Следите за обновлениями!
            </p>
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-16">
            {/* Upcoming Events */}
            {serializedUpcomingEvents.length > 0 && (
              <div>
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    Предстоящие события
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-sm text-muted-foreground md:text-base">
                    Скоро начнутся эти мероприятия
                  </p>
                </div>
                <AnimatedEventCard events={serializedUpcomingEvents} />
              </div>
            )}

            {/* Past Events */}
            {serializedPastEvents.length > 0 && (
              <div>
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    Прошедшие события
                  </h3>
                </div>
                <AnimatedEventCard events={serializedPastEvents} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

