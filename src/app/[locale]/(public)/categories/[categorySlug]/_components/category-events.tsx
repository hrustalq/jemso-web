import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { getLocale } from "next-intl/server";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import { api } from "~/trpc/server";

interface CategoryEventsProps {
  categoryId: string;
}

export async function CategoryEvents({ categoryId }: CategoryEventsProps) {
  // Get current locale
  const locale = await getLocale();
  const dateLocale = locale === "ru" ? ru : enUS;
  
  const { items: events } = await api.event.events.list({
    page: 1,
    pageSize: 6,
    published: true,
    categoryId,
    upcoming: true,
    locale, // Pass locale for translations
  });

  if (events.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Предстоящие события</h2>
        <Link
          href={`/events?category=${categoryId}`}
          className="text-sm text-primary hover:underline"
        >
          Смотреть все →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const isFull = event.maxParticipants
            ? event._count.registrations >= event.maxParticipants
            : false;

          return (
            <Link key={event.id} href={`/events/${event.slug}`}>
              <Card className="h-full transition-colors hover:bg-accent">
                {event.coverImage && (
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {event.price.toNumber() === 0 ? (
                      <Badge variant="outline" className="bg-green-500/10">
                        Бесплатно
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        ${event.price.toString()} {event.currency}
                      </Badge>
                    )}
                    {isFull && (
                      <Badge variant="outline" className="bg-red-500/10">
                        Нет мест
                      </Badge>
                    )}
                  </div>

                  <h3 className="mb-3 line-clamp-2 font-bold">{event.title}</h3>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(event.startDate), "d MMM yyyy, HH:mm", {
                          locale: dateLocale,
                        })}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                    {event.maxParticipants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {event._count.registrations} / {event.maxParticipants}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

