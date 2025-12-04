"use client";

import { memo, useCallback, useMemo } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, Globe, Navigation } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

interface Event {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  startDate: Date;
  endDate: Date;
  location: string | null;
  city: string | null;
  country: string | null;
  isOnline: boolean;
  onlineUrl: string | null;
  maxParticipants: number | null;
  price: number;
  currency: string;
  coverImage: string | null;
  distance: number | null; // Distance in km from user's location
  category: {
    name: string;
    slug: string;
    color: string | null;
  } | null;
  venue: {
    name: string;
    city: string;
    country: string;
  } | null;
  _count: {
    registrations: number;
  };
}

interface EventCardProps {
  events: Event[];
}

export const EventCard = memo(function EventCard({ events }: EventCardProps) {
  const t = useTranslations("Events");
  const locale = useLocale();
  
  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [locale]);
  
  const formatDistance = useCallback((distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} ${t("meters")}`;
    }
    return `${distance.toFixed(1)} ${t("kilometers")}`;
  }, [t]);

  const isPastEvent = useCallback((endDate: Date) => {
    return new Date(endDate) < new Date();
  }, []);

  // Generate calendar file (.ics) for adding event to calendar
  const generateCalendarEvent = useCallback((event: Event) => {
    const formatICSDate = (date: Date) => {
      return new Date(date)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    };

    const startDate = formatICSDate(new Date(event.startDate));
    const endDate = formatICSDate(new Date(event.endDate));
    const description = event.excerpt ?? "";
    const location = event.location ?? "";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//JEMSO//Event Calendar//RU",
      "BEGIN:VEVENT",
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `URL:${typeof window !== "undefined" ? window.location.origin : ""}/events/${event.slug}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
  }, []);

  const handleAddToCalendar = useCallback((e: React.MouseEvent, event: Event) => {
    e.preventDefault();
    e.stopPropagation();

    const calendarUrl = generateCalendarEvent(event);
    const link = document.createElement("a");
    link.href = calendarUrl;
    link.download = `${event.slug}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generateCalendarEvent]);

  const handleMapClick = useCallback((e: React.MouseEvent, location: string) => {
    e.preventDefault();
    e.stopPropagation();

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  }, []);

  // Memoize category badge styles
  const getCategoryStyle = useMemo(() => {
    const styleCache = new Map<string | null, React.CSSProperties>();
    return (color: string | null) => {
      if (!styleCache.has(color)) {
        styleCache.set(color, { backgroundColor: color ?? undefined });
      }
      return styleCache.get(color)!;
    };
  }, []);

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <Link
          key={event.id}
          href={`/events/${event.slug}`}
          className={`animate animate-fadeInUp stagger-${index + 1} group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary`}
        >
          {/* Cover Image */}
          {event.coverImage ? (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={event.coverImage}
                alt={event.title}
                width={800}
                height={450}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full object-cover"
              />
              {event.category && (
                <Badge
                  className="absolute right-2 top-2 sm:right-3 sm:top-3 text-xs"
                  style={getCategoryStyle(event.category.color)}
                >
                  {event.category.name}
                </Badge>
              )}
            </div>
          ) : (
            <div className="relative aspect-video w-full bg-linear-to-br from-primary/20 to-primary/5">
              {event.category && (
                <Badge
                  className="absolute right-2 top-2 sm:right-3 sm:top-3 text-xs"
                  style={getCategoryStyle(event.category.color)}
                >
                  {event.category.name}
                </Badge>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4 sm:p-6">
            <h3 className="mb-2 text-lg sm:text-xl font-bold text-foreground transition-colors group-hover:text-primary">
              {event.title}
            </h3>

            {event.excerpt && (
              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-foreground/80 line-clamp-2">
                {event.excerpt}
              </p>
            )}

            <div className="text-sm">
              <button
                onClick={(e) => handleAddToCalendar(e, event)}
                className="flex w-full items-center gap-2 rounded-md border border-transparent p-2 -ml-2 cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary active:bg-primary/10 group/button"
                title={t("addToCalendar")}
              >
                <Calendar className="h-4 w-4 shrink-0 transition-transform group-hover/button:scale-110" />
                <span className="text-left underline decoration-transparent decoration-1 underline-offset-2 transition-colors group-hover/button:decoration-primary">
                  {formatDate(event.startDate)}
                  {event.endDate &&
                    new Date(event.endDate).getTime() !==
                      new Date(event.startDate).getTime() && (
                      <> - {formatDate(event.endDate)}</>
                    )}
                </span>
              </button>

              {/* Online Event Badge */}
              {event.isOnline && (
                <div className="flex items-center gap-2 p-2 -ml-2 text-primary">
                  <Globe className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">
                    {t("onlineEvent")}
                  </span>
                </div>
              )}
              
              {/* Physical Location */}
              {!event.isOnline && (event.location ?? event.venue) && (
                <button
                  onClick={(e) => handleMapClick(e, event.location ?? event.venue?.name ?? "")}
                  className="flex w-full items-center gap-2 rounded-md border border-transparent p-2 -ml-2 cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary active:bg-primary/10 group/button"
                  title={t("openInMaps")}
                >
                  <MapPin className="h-4 w-4 shrink-0 transition-transform group-hover/button:scale-110" />
                  <span className="line-clamp-1 text-left underline decoration-transparent decoration-1 underline-offset-2 transition-colors group-hover/button:decoration-primary">
                    {event.venue?.name ?? event.location}
                    {event.city && `, ${event.city}`}
                  </span>
                </button>
              )}
              
              {/* Distance from user */}
              {event.distance !== null && event.distance !== undefined && (
                <div className="flex items-center gap-2 p-2 -ml-2 text-muted-foreground">
                  <Navigation className="h-4 w-4 shrink-0" />
                  <span className="text-sm">
                    {formatDistance(event.distance)} {t("away")}
                  </span>
                </div>
              )}

              {!isPastEvent(event.endDate) && event.maxParticipants && (
                <div className="flex items-center gap-2 p-1 text-xs sm:text-sm">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>
                    {event._count.registrations} / {event.maxParticipants} {t("participants")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
});
