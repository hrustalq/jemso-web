import { getTranslations, getLocale } from "next-intl/server";
import { api } from "~/trpc/server";
import { SectionHeader } from "~/components/section-header";
import { EventCard } from "~/components/event-card";
import { SectionBackground } from "~/components/section-background";

export async function EventsSection() {
  // Get current locale
  const locale = await getLocale();
  
  // Fetch data and translations in parallel
  const [t, upcomingEvents, pastEvents] = await Promise.all([
    getTranslations("HomePage.events"),
    api.event.events.list({
      page: 1,
      pageSize: 3,
      published: true,
      upcoming: true,
      locale, // Pass locale for translations
    }),
    api.event.events.list({
      page: 1,
      pageSize: 3,
      published: true,
      past: true,
      locale, // Pass locale for translations
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

  const hasEvents =
    serializedUpcomingEvents.length > 0 || serializedPastEvents.length > 0;

  return (
    <section className="snap-start flex items-center justify-center py-8 sm:py-12 md:py-16 relative section-min-h-full">
      <SectionBackground variant="purple" intensity="low" />
      <div className="container mx-auto px-3 sm:px-4 w-full relative z-10">
        <SectionHeader
          title={t("title")}
          linkText={t("linkText")}
          linkHref="/events"
        />

        {!hasEvents ? (
          <div className="rounded-lg border border-border/40 bg-card/50 p-8 sm:p-12 text-center backdrop-blur">
            <p className="text-base sm:text-lg text-muted-foreground">
              {t("noEvents")}
            </p>
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-16">
            {/* Upcoming Events */}
            {serializedUpcomingEvents.length > 0 && (
              <div>
                <div className="mb-6 sm:mb-8">
                  <h3 className="animate animate-fadeInLeft text-xl sm:text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {t("upcoming.title")}
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-sm text-muted-foreground md:text-base">
                    {t("upcoming.subtitle")}
                  </p>
                </div>
                <EventCard events={serializedUpcomingEvents} />
              </div>
            )}

            {/* Past Events */}
            {serializedPastEvents.length > 0 && (
              <div>
                <div className="mb-6 sm:mb-8">
                  <h3 className="animate animate-fadeInLeft text-xl sm:text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {t("past.title")}
                  </h3>
                </div>
                <EventCard events={serializedPastEvents} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
