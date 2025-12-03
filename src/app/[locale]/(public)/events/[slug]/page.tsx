import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HydrateClient, api } from "~/trpc/server";
import Image from "next/image";
import { Decimal } from "decimal.js";
import { BlocksRenderer } from "~/components/blocks/block-renderer";
import { isValidPostContent } from "~/lib/blocks/utils";
import type { Block } from "~/lib/blocks/types";
import { EventRegistration } from "./_components/event-registration";
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  ClockIcon,
  DollarSignIcon,
} from "lucide-react";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

import { PageWrapper } from "~/components/page-wrapper";

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const event = await api.event.events.getBySlug({ slug });
    const price = new Decimal(event.price);
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const now = new Date();
    const isUpcoming = startDate > now;
    const isOngoing = startDate <= now && endDate >= now;

    const statusText = isUpcoming 
      ? "Скоро" 
      : isOngoing 
        ? "Идёт сейчас" 
        : "Завершено";

    const priceText = price.isZero() 
      ? "Бесплатно" 
      : `${price.toNumber()} ${event.currency}`;

    const dateText = startDate.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const keywords: string[] = [
      "событие",
      "мероприятие",
      "JEMSO",
      "JEMSO EVENTS",
    ];
    if (event.category) {
      keywords.push(event.category.name);
    }
    if (event.location) {
      keywords.push(event.location);
    }

    return {
      title: event.title,
      description: event.excerpt ?? `${event.title}. ${statusText}. ${dateText}. ${event.location ? `Место: ${event.location}.` : ""} ${priceText}.`,
      keywords,
      authors: event.author?.name ? [{ name: event.author.name }] : undefined,
      openGraph: {
        title: event.title,
        description: event.excerpt ?? `${event.title}. ${statusText}. ${dateText}.`,
        type: "website",
        ...(event.coverImage && {
          images: [
            {
              url: event.coverImage,
              width: 1200,
              height: 630,
              alt: event.title,
            },
          ],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title: event.title,
        description: event.excerpt ?? `${event.title}. ${statusText}. ${dateText}.`,
        ...(event.coverImage && {
          images: [event.coverImage],
        }),
      },
    };
  } catch {
    return {
      title: "Событие не найдено",
      description: "Запрашиваемое событие не найдено.",
    };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;

  try {
    const event = await api.event.events.getBySlug({ slug });

    // Serialize Decimal to number for display
    const price = new Decimal(event.price).toNumber();

    // Calculate event status
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const isUpcoming = startDate > now;
    const isOngoing = startDate <= now && endDate >= now;
    const isPast = endDate < now;

    // Calculate spots remaining
    const spotsRemaining = event.maxParticipants 
      ? event.maxParticipants - event._count.registrations 
      : null;

    return (
      <HydrateClient>
        <PageWrapper withHeaderOffset={false} className="article-pt">
          <article>
            <div className="container mx-auto px-4 py-4 md:py-10">
              <div className="mx-auto max-w-4xl">
                {/* Back link */}
                <Link
                  href="/events"
                  className="mb-8 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  ← Назад к событиям
                </Link>

                {/* Cover Image */}
                {event.coverImage && (
                  <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      width={1200}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Status Badge */}
                <div className="mb-4">
                  {isUpcoming && (
                    <span className="inline-block rounded-md bg-green-500/10 px-3 py-1 text-sm font-semibold uppercase text-green-500">
                      Скоро
                    </span>
                  )}
                  {isOngoing && (
                    <span className="inline-block rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold uppercase text-primary">
                      Идёт сейчас
                    </span>
                  )}
                  {isPast && (
                    <span className="inline-block rounded-md bg-muted px-3 py-1 text-sm font-semibold uppercase text-muted-foreground">
                      Завершено
                    </span>
                  )}
                </div>

                {/* Category */}
                {event.category && (
                  <div className="mb-4">
                    <Link
                      href={`/categories/${event.category.slug}`}
                      className="inline-block rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold uppercase text-primary transition-colors hover:bg-primary/20"
                    >
                      {event.category.name}
                    </Link>
                  </div>
                )}

                {/* Title */}
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                  {event.title}
                </h1>

                {/* Excerpt */}
                {event.excerpt && (
                  <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
                    {event.excerpt}
                  </p>
                )}

                {/* Event Details Grid */}
                <div className="mb-8 grid gap-4 rounded-lg border border-border/40 bg-card p-6 sm:grid-cols-2">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Дата начала
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {startDate.toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {startDate.toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-start gap-3">
                    <ClockIcon className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Окончание
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {endDate.toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {endDate.toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="mt-1 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Место
                        </p>
                        <p className="text-lg font-bold text-foreground">{event.location}</p>
                        {event.locationUrl && (
                          <a
                            href={event.locationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Открыть на карте →
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Participants */}
                  <div className="flex items-start gap-3">
                    <UsersIcon className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Участники
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {event._count.registrations} зарегистрировано
                      </p>
                      {spotsRemaining !== null && (
                        <p className="text-sm text-muted-foreground">
                          {spotsRemaining > 0 
                            ? `Осталось мест: ${spotsRemaining}`
                            : "Мест не осталось"}
                        </p>
                      )}
                      {event.maxParticipants === null && (
                        <p className="text-sm text-muted-foreground">
                          Без ограничений
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  {price > 0 && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <DollarSignIcon className="mt-1 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Стоимость
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {price.toLocaleString("ru-RU")} {event.currency}
                        </p>
                      </div>
                    </div>
                  )}
                  {price === 0 && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <DollarSignIcon className="mt-1 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Стоимость
                        </p>
                        <p className="text-2xl font-bold text-green-500">
                          Бесплатно
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Registration CTA */}
                <EventRegistration
                  eventId={event.id}
                  eventTitle={event.title}
                  price={price}
                  currency={event.currency}
                  spotsRemaining={spotsRemaining}
                  isUpcoming={isUpcoming}
                />

                {/* Organizer */}
                {event.author && (
                  <div className="mb-8 flex items-center gap-4 rounded-lg border border-border/40 bg-card p-4">
                    {event.author.image && (
                      <Image
                        src={event.author.image}
                        alt={event.author.name ?? "Organizer"}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Организатор
                      </p>
                      <p className="text-lg font-bold">{event.author.name}</p>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="mb-8">
                  {event.blocks && isValidPostContent(event.blocks) ? (
                    <div className="prose prose-invert max-w-none">
                      <BlocksRenderer
                        blocks={(event.blocks as { version: string; blocks: Block[] }).blocks}
                      />
                    </div>
                  ) : event.content ? (
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: event.content }}
                    />
                  ) : null}
                </div>

                {/* Views */}
                <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
                  Просмотров: {event.views}
                </div>
              </div>
            </div>
          </article>
        </PageWrapper>
      </HydrateClient>
    );
  } catch {
    notFound();
  }
}

