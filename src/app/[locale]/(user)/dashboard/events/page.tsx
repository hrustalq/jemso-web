"use client";

import { useTranslations, useLocale } from "next-intl";
import { api } from "~/trpc/react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Clock,
  CalendarCheck,
  CalendarX,
  Loader2,
} from "lucide-react";
import { Link } from "~/i18n/navigation";

export default function UserEventsPage() {
  const t = useTranslations("Dashboard.eventsPage");
  const { data: registrations, isLoading } = api.event.registrations.myRegistrations.useQuery();

  // Filter past events (those with startDate < now)
  const now = new Date();
  const upcoming = registrations?.filter(reg => new Date(reg.event.startDate) > now) ?? [];
  const past = registrations?.filter(reg => new Date(reg.event.startDate) <= now) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="upcoming" className="gap-2">
            <CalendarCheck className="h-4 w-4" />
            {t("upcoming")} ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2">
            <CalendarX className="h-4 w-4" />
            {t("past")} ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border-border/40 bg-card/50 backdrop-blur">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Skeleton className="h-20 w-20 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcoming.length > 0 ? (
            <div className="space-y-4">
              {upcoming.map((reg) => (
                <EventCard key={reg.id} registration={reg} />
              ))}
            </div>
          ) : (
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">{t("noUpcoming")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("noUpcomingHint")}
                </p>
                <Button asChild>
                  <Link href="/events">{t("viewEvents")}</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : past.length > 0 ? (
            <div className="space-y-4">
              {past.map((reg) => (
                <EventCard key={reg.id} registration={reg} isPast />
              ))}
            </div>
          ) : (
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardContent className="py-12 text-center">
                <CalendarX className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">{t("noPast")}</h3>
                <p className="text-muted-foreground">
                  {t("noPastHint")}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface EventCardProps {
  registration: {
    id: string;
    status: string;
    event: {
      id: string;
      title: string;
      slug: string;
      startDate: Date;
      endDate: Date;
      location: string | null;
    };
  };
  isPast?: boolean;
}

function EventCard({ registration, isPast }: EventCardProps) {
  const t = useTranslations("Dashboard.eventsPage");
  const locale = useLocale();
  
  const statusColors: Record<string, string> = {
    confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    canceled: "bg-red-500/10 text-red-500 border-red-500/20",
    attended: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const getStatusLabel = (status: string) => {
    const statusKey = status as "confirmed" | "pending" | "canceled" | "attended";
    return t(`status.${statusKey}`);
  };

  return (
    <Card className={`border-border/40 bg-card/50 backdrop-blur ${isPast ? "opacity-75" : ""}`}>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          {/* Date Badge */}
          <div className="shrink-0 w-20 h-20 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-primary">
              {new Date(registration.event.startDate).getDate()}
            </span>
            <span className="text-xs text-muted-foreground uppercase">
              {new Date(registration.event.startDate).toLocaleDateString(locale, { month: "short" })}
            </span>
          </div>

          {/* Event Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link 
                  href={`/events/${registration.event.slug}`}
                  className="font-semibold hover:text-primary transition-colors line-clamp-1"
                >
                  {registration.event.title}
                </Link>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(registration.event.startDate).toLocaleTimeString(locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {registration.event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {registration.event.location}
                    </span>
                  )}
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={statusColors[registration.status] ?? ""}
              >
                {getStatusLabel(registration.status)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

