import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Decimal } from "decimal.js";
import type { Metadata } from "next";
import { HydrateClient, api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { PageWrapper } from "~/components/page-wrapper";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const events = await api.event.events.list({
    published: true,
    upcoming: true,
    pageSize: 1,
  });

  const upcomingEvent = events.items[0];
  const eventCount = events.total;

  return {
    title: "События",
    description: `Находите и участвуйте в интересных событиях JEMSO. ${eventCount > 0 ? `Доступно ${eventCount} предстоящих событий: фестивали, гонки, чемпионаты по дрифту и дрэг-рейсингу, автомобильные шоу.` : "Фестивали, гонки, чемпионаты по дрифту и дрэг-рейсингу, автомобильные шоу."}`,
    keywords: [
      "автомобильные события",
      "фестивали",
      "гонки",
      "дрифт",
      "дрэг-рейсинг",
      "автомобильные шоу",
      "автопробеги",
      "чемпионаты",
      "JEMSO EVENTS",
    ],
    openGraph: {
      title: "События | JEMSO",
      description: `Находите и участвуйте в интересных событиях JEMSO. Фестивали, гонки, чемпионаты по дрифту и дрэг-рейсингу, автомобильные шоу.`,
      type: "website",
      ...(upcomingEvent?.coverImage && {
        images: [
          {
            url: upcomingEvent.coverImage,
            width: 1200,
            height: 630,
            alt: upcomingEvent.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: "События | JEMSO",
      description: `Находите и участвуйте в интересных событиях JEMSO. Фестивали, гонки, чемпионаты по дрифту и дрэг-рейсингу.`,
    },
  };
}

export default async function EventsPage() {
  const events = await api.event.events.list({
    published: true,
    upcoming: true,
    pageSize: 10,
  });

  return (
    <HydrateClient>
      <PageWrapper>
        <div className="border-b border-border/40 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
              СОБЫТИЯ
            </h1>
            <p className="text-lg font-bold text-primary sm:text-xl">
              Находите и участвуйте в интересных событиях
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.items.map((event) => {
              const price = new Decimal(event.price);
              return (
                <Card key={event.id} className="flex flex-col">
                  {event.coverImage && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="secondary">
                        {event.category?.name ?? "Event"}
                      </Badge>
                      {price.isZero() ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Бесплатно
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          {price.toNumber()} {event.currency}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(event.startDate), "d MMM yyyy, HH:mm", {
                          locale: ru,
                        })}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/events/${event.slug}`}>Подробнее</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}

            {events.items.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-lg text-muted-foreground">
                  Предстоящих событий не найдено.
                </p>
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    </HydrateClient>
  );
}
