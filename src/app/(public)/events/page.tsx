import { HydrateClient, api } from "~/trpc/server";
import { AnimatedSectionHeader } from "~/components/animated-section-header";
import { AnimatedEventCard } from "~/components/animated-event-card";
import { ScrollReveal } from "~/components/scroll-reveal";

export default async function EventsPage() {
  const events = await api.event.events.list({
    page: 1,
    pageSize: 12,
    published: true,
  });

  // Serialize Decimal to number for client components
  const serializedEvents = events.items.map((event) => ({
    ...event,
    price: event.price.toNumber(),
  }));

  const upcomingEvents = serializedEvents.filter(
    (event) => new Date(event.startDate) > new Date()
  );

  const pastEvents = serializedEvents.filter(
    (event) => new Date(event.startDate) <= new Date()
  );

  return (
    <HydrateClient>
      <main className="container mx-auto min-h-[var(--content-height)] px-4 py-16" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
        <ScrollReveal animation="fadeIn">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              События JEMSO
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Дрифт-баттлы, трек-дни, автошоу и другие мероприятия от JEMSO Drive.
              Присоединяйтесь к нам и станьте частью автоспортивного сообщества!
            </p>
          </div>
        </ScrollReveal>

        {serializedEvents.length > 0 ? (
          <>
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <section className="mb-16">
                <AnimatedSectionHeader title="Предстоящие события" />
                <AnimatedEventCard events={upcomingEvents} />
              </section>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <section>
                <AnimatedSectionHeader title="Прошедшие события" />
                <AnimatedEventCard events={pastEvents} />
              </section>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-border/40 bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">
              Пока нет запланированных событий. Следите за обновлениями!
            </p>
          </div>
        )}
      </main>
    </HydrateClient>
  );
}

