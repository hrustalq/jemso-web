"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Event {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  startDate: Date;
  endDate: Date;
  location: string | null;
  maxParticipants: number | null;
  price: number;
  currency: string;
  coverImage: string | null;
  category: {
    name: string;
    slug: string;
    color: string | null;
  } | null;
  _count: {
    registrations: number;
  };
}

interface AnimatedEventCardProps {
  events: Event[];
}

export function AnimatedEventCard({ events }: AnimatedEventCardProps) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".event-card");
    if (cards.length === 0) return;

    // Set initial state
    cards.forEach((card) => {
      gsap.set(card, { 
        opacity: 0, 
        y: 30,
        willChange: "transform, opacity"
      });
    });

    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top bottom-=50",
        once: true, // Only animate once
      },
    });

    // Animate each card
    cards.forEach((card, index) => {
      tl.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(card, { willChange: "auto" });
        }
      }, index * 0.08);
    });

    // Hover animations removed - cards stay in place

    return () => {
      tl.kill();
    };
  }, [events]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isPastEvent = (endDate: Date) => {
    return new Date(endDate) < new Date();
  };

  // Generate calendar file (.ics) for adding event to calendar
  const generateCalendarEvent = (event: Event) => {
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
  };

  const handleAddToCalendar = (e: React.MouseEvent, event: Event) => {
    e.preventDefault();
    e.stopPropagation();
    
    const calendarUrl = generateCalendarEvent(event);
    const link = document.createElement("a");
    link.href = calendarUrl;
    link.download = `${event.slug}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMapClick = (e: React.MouseEvent, location: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={cardsRef} className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Link 
          key={event.id} 
          href={`/events/${event.slug}`}
          className="event-card group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary"
        >
          {/* Cover Image */}
          {event.coverImage ? (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={event.coverImage}
                alt={event.title}
                width={800}
                height={450}
                className="h-full w-full object-cover"
              />
              {event.category && (
                <Badge
                  className="absolute right-2 top-2 sm:right-3 sm:top-3 text-xs"
                  style={{
                    backgroundColor: event.category.color ?? undefined,
                  }}
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
                  style={{
                    backgroundColor: event.category.color ?? undefined,
                  }}
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
                title="Добавить в календарь"
              >
                <Calendar className="h-4 w-4 shrink-0 transition-transform group-hover/button:scale-110" />
                <span className="text-left underline decoration-transparent decoration-1 underline-offset-2 transition-colors group-hover/button:decoration-primary">
                  {formatDate(event.startDate)}
                  {event.endDate && new Date(event.endDate).getTime() !== new Date(event.startDate).getTime() && (
                    <> - {formatDate(event.endDate)}</>
                  )}
                </span>
              </button>

              {event.location && (
                <button
                  onClick={(e) => handleMapClick(e, event.location!)}
                  className="flex w-full items-center gap-2 rounded-md border border-transparent p-2 -ml-2 cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary active:bg-primary/10 group/button"
                  title="Открыть на карте"
                >
                  <MapPin className="h-4 w-4 shrink-0 transition-transform group-hover/button:scale-110" />
                  <span className="line-clamp-1 text-left underline decoration-transparent decoration-1 underline-offset-2 transition-colors group-hover/button:decoration-primary">{event.location}</span>
                </button>
              )}

              {!isPastEvent(event.endDate) && event.maxParticipants && (
                <div className="flex items-center gap-2 p-1 text-xs sm:text-sm">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>
                    {event._count.registrations} / {event.maxParticipants} участников
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

