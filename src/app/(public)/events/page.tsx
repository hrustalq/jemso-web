"use client";

import { api } from "~/trpc/react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Decimal } from "decimal.js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Calendar, MapPin, Loader2 } from "lucide-react";
import { PageWrapper } from "~/components/page-wrapper";

export default function EventsPage() {
  const { data, isLoading } = api.event.events.list.useQuery({
    published: true,
    upcoming: true,
    pageSize: 10,
  });

  if (isLoading) {
    return (
      <PageWrapper className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </PageWrapper>
    );
  }

  return (
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
        <div className="mb-6 flex items-center justify-end">
          <Button asChild>
            <Link href="/events/create">Добавить событие</Link>
          </Button>
        </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((event) => (
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
                {new Decimal(event.price).isZero() ? (
                   <Badge variant="outline" className="text-green-600 border-green-600">Бесплатно</Badge>
                ) : (
                   <Badge variant="outline">{new Decimal(event.price).toNumber()} {event.currency}</Badge>
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
                <span>{format(new Date(event.startDate), "MMM d, yyyy h:mm a")}</span>
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
        ))}

        {data?.items.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-lg text-muted-foreground">Предстоящих событий не найдено.</p>
          </div>
        )}
      </div>
      </div>
    </PageWrapper>
  );
}
