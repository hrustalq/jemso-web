import type { Metadata } from "next";
import Image from "next/image";
import { format } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { Decimal } from "decimal.js";
import { getTranslations, getLocale } from "next-intl/server";
import { HydrateClient, api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { PageWrapper } from "~/components/page-wrapper";
import { Link } from "~/i18n/navigation";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Events" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title") + " | JEMSO",
      description: t("metadata.description"),
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t("metadata.title") + " | JEMSO",
      description: t("metadata.description"),
    },
  };
}

export default async function EventsPage() {
  const t = await getTranslations("Events");
  const locale = await getLocale();
  const dateLocale = locale === "ru" ? ru : enUS;

  const events = await api.event.events.list({
    published: true,
    upcoming: true,
    pageSize: 10,
  });

  return (
    <HydrateClient>
      <PageWrapper>
        <div className="container mx-auto px-4 py-8 md:py-12">
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
                          {t("free")}
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
                          locale: dateLocale,
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
                      <Link href={`/events/${event.slug}`}>{t("details")}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}

            {events.items.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-lg text-muted-foreground">
                  {t("noEvents")}
                </p>
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    </HydrateClient>
  );
}
