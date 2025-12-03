import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { api } from "~/trpc/server";
import { Link } from "~/i18n/navigation";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Calendar, MapPin, ArrowRight, Newspaper } from "lucide-react";

interface PromoBannerHeroProps {
  className?: string;
}

export async function PromoBannerHero({ className }: PromoBannerHeroProps) {
  const t = await getTranslations("HomePage.promoBanner");
  const locale = await getLocale();

  // Fetch featured events and news in parallel
  const [eventsResponse, newsResponse] = await Promise.all([
    api.event.events.list({
      page: 1,
      pageSize: 4,
      published: true,
      upcoming: true,
      locale,
    }),
    api.blog.posts.list({
      page: 1,
      pageSize: 4,
      published: true,
    }),
  ]);

  const events = eventsResponse.items.map((event) => ({
    ...event,
    price: event.price.toNumber(),
    type: "event" as const,
  }));

  const news = newsResponse.items.map((item) => ({
    ...item,
    type: "news" as const,
  }));

  // Combine and alternate between events and news for variety
  const allItems: Array<(typeof events)[0] | (typeof news)[0]> = [];
  const maxLength = Math.max(events.length, news.length);

  for (let i = 0; i < maxLength; i++) {
    const event = events[i];
    const newsItem = news[i];
    if (event) allItems.push(event);
    if (newsItem) allItems.push(newsItem);
  }

  // Take first item as main banner, rest as cards
  const mainItem = allItems[0];
  const secondaryItems = allItems.slice(1, 5);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!mainItem) {
    return (
      <div className={className}>
        <div className="rounded-2xl border border-border/40 bg-card/50 p-12 text-center backdrop-blur">
          <p className="text-lg text-muted-foreground">{t("noContent")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Main Featured Banner */}
      <div className="mb-6 sm:mb-8">
        {mainItem.type === "event" ? (
          <MainEventBanner
            event={mainItem}
            t={t}
            locale={locale}
            formatDate={formatDate}
          />
        ) : (
          <MainNewsBanner news={mainItem} t={t} locale={locale} formatDate={formatDate} />
        )}
      </div>

      {/* Secondary Banner Cards Grid */}
      {secondaryItems.length > 0 && (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {secondaryItems.map((item, index) =>
            item.type === "event" ? (
              <SecondaryEventCard
                key={item.id}
                event={item}
                t={t}
                locale={locale}
                formatDate={formatDate}
                index={index}
              />
            ) : (
              <SecondaryNewsCard
                key={item.id}
                news={item}
                t={t}
                locale={locale}
                formatDate={formatDate}
                index={index}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

// Main Event Banner Component
function MainEventBanner({
  event,
  t,
  locale,
  formatDate,
}: {
  event: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    startDate: Date;
    location: string | null;
    city: string | null;
    price: number;
    currency: string;
    category: { name: string; color: string | null } | null;
  };
  t: (key: string) => string;
  locale: string;
  formatDate: (date: Date) => string;
}) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-border/40 bg-linear-to-br from-background via-background/95 to-primary/5"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="relative aspect-video lg:aspect-21/9 w-full lg:w-2/3 overflow-hidden">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/90 lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden" />
          
          {/* Category Badge - Mobile */}
          {event.category && (
            <Badge
              className="absolute left-4 top-4 lg:hidden text-xs font-semibold uppercase tracking-wide"
              style={{ backgroundColor: event.category.color ?? undefined }}
            >
              {event.category.name}
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2 lg:p-10">
          {/* Desktop Category Badge */}
          {event.category && (
            <Badge
              className="hidden lg:inline-flex w-fit mb-4 text-xs font-semibold uppercase tracking-wide"
              style={{ backgroundColor: event.category.color ?? undefined }}
            >
              {event.category.name}
            </Badge>
          )}

          {/* Label */}
          <span className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
            {t("upcomingEvent")}
          </span>

          {/* Title */}
          <h2 className="mb-4 text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl lg:text-4xl xl:text-5xl group-hover:text-primary transition-colors">
            {event.title}
          </h2>

          {/* Excerpt */}
          {event.excerpt && (
            <p className="mb-6 text-sm text-foreground/70 line-clamp-2 sm:text-base lg:line-clamp-3">
              {event.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-foreground/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(event.startDate)}
            </span>
            {(event.location ?? event.city) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {event.location ?? event.city}
              </span>
            )}
          </div>

          {/* Price and CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="font-semibold uppercase tracking-wide group/btn">
              {t("register")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
            <span className="text-xl font-bold text-primary">
              {event.price === 0 ? t("free") : `${event.price} ${event.currency}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Main News Banner Component
function MainNewsBanner({
  news,
  t,
  locale,
  formatDate,
}: {
  news: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
    createdAt: Date;
    category: { id: string; name: string } | null;
  };
  t: (key: string) => string;
  locale: string;
  formatDate: (date: Date) => string;
}) {
  return (
    <Link
      href={`/blog/${news.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-background via-background/95 to-accent/5"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="relative aspect-[16/9] lg:aspect-[21/9] w-full lg:w-2/3 overflow-hidden">
          {news.coverImage ? (
            <Image
              src={news.coverImage}
              alt={news.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-accent/30 via-accent/10 to-transparent flex items-center justify-center">
              <Newspaper className="h-16 w-16 text-accent/40" />
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/90 lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden" />
          
          {/* Category Badge - Mobile */}
          {news.category && (
            <Badge className="absolute left-4 top-4 lg:hidden text-xs font-semibold uppercase tracking-wide bg-accent text-accent-foreground">
              {news.category.name}
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2 lg:p-10">
          {/* Desktop Category Badge */}
          {news.category && (
            <Badge className="hidden lg:inline-flex w-fit mb-4 text-xs font-semibold uppercase tracking-wide bg-accent text-accent-foreground">
              {news.category.name}
            </Badge>
          )}

          {/* Label */}
          <span className="mb-2 text-xs font-bold uppercase tracking-widest text-accent-foreground/70">
            {t("latestNews")}
          </span>

          {/* Title */}
          <h2 className="mb-4 text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl lg:text-4xl xl:text-5xl group-hover:text-primary transition-colors">
            {news.title}
          </h2>

          {/* Excerpt */}
          {news.excerpt && (
            <p className="mb-6 text-sm text-foreground/70 line-clamp-2 sm:text-base lg:line-clamp-3">
              {news.excerpt}
            </p>
          )}

          {/* Date */}
          <div className="mb-6 flex items-center gap-4 text-sm text-foreground/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(news.publishedAt ?? news.createdAt)}
            </span>
          </div>

          {/* CTA */}
          <Button size="lg" variant="outline" className="w-fit font-semibold uppercase tracking-wide group/btn">
            {t("readMore")}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </Link>
  );
}

// Secondary Event Card Component
function SecondaryEventCard({
  event,
  t,
  locale,
  formatDate,
  index,
}: {
  event: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    startDate: Date;
    location: string | null;
    city: string | null;
    price: number;
    currency: string;
    category: { name: string; color: string | null } | null;
  };
  t: (key: string) => string;
  locale: string;
  formatDate: (date: Date) => string;
  index: number;
}) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className={`animate animate-fadeInUp stagger-${index + 1} group relative flex overflow-hidden rounded-xl border border-border/40 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5`}
    >
      {/* Image */}
      <div className="relative w-1/3 min-w-[120px] sm:min-w-[160px] overflow-hidden">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        {/* Category Badge */}
        {event.category && (
          <Badge
            className="absolute left-2 top-2 text-[10px] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: event.category.color ?? undefined }}
          >
            {event.category.name}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Label */}
          <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            {t("upcomingEvent")}
          </span>
          
          {/* Title */}
          <h3 className="mb-2 text-sm font-bold text-foreground line-clamp-2 sm:text-base group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {/* Date & Location */}
          <div className="flex flex-col gap-1 text-xs text-foreground/60">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(event.startDate)}
            </span>
            {(event.location ?? event.city) && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{event.location ?? event.city}</span>
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-primary">
            {event.price === 0 ? t("free") : `${event.price} ${event.currency}`}
          </span>
          <ArrowRight className="h-4 w-4 text-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}

// Secondary News Card Component
function SecondaryNewsCard({
  news,
  t,
  locale,
  formatDate,
  index,
}: {
  news: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
    createdAt: Date;
    category: { id: string; name: string } | null;
  };
  t: (key: string) => string;
  locale: string;
  formatDate: (date: Date) => string;
  index: number;
}) {
  return (
    <Link
      href={`/blog/${news.slug}`}
      className={`animate animate-fadeInUp stagger-${index + 1} group relative flex overflow-hidden rounded-xl border border-border/40 bg-card/50 backdrop-blur transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5`}
    >
      {/* Image */}
      <div className="relative w-1/3 min-w-[120px] sm:min-w-[160px] overflow-hidden">
        {news.coverImage ? (
          <Image
            src={news.coverImage}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
            <Newspaper className="h-8 w-8 text-accent/40" />
          </div>
        )}
        {/* Category Badge */}
        {news.category && (
          <Badge className="absolute left-2 top-2 text-[10px] font-semibold uppercase tracking-wide bg-accent text-accent-foreground">
            {news.category.name}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Label */}
          <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground/70">
            {t("latestNews")}
          </span>
          
          {/* Title */}
          <h3 className="mb-2 text-sm font-bold text-foreground line-clamp-2 sm:text-base group-hover:text-primary transition-colors">
            {news.title}
          </h3>

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-foreground/60">
            <Calendar className="h-3 w-3" />
            {formatDate(news.publishedAt ?? news.createdAt)}
          </div>
        </div>

        {/* CTA Arrow */}
        <div className="mt-3 flex items-center justify-end">
          <ArrowRight className="h-4 w-4 text-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}

