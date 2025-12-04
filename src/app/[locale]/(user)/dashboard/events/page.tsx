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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md h-auto">
          <TabsTrigger value="upcoming" className="gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3">
            <CalendarCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="truncate">{t("upcoming")} ({upcoming.length})</span>
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3">
            <CalendarX className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="truncate">{t("past")} ({past.length})</span>
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
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Date Badge - smaller on mobile, row layout */}
          <div className="flex sm:flex-col items-center gap-3 sm:gap-0">
            <div className="shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-center">
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {new Date(registration.event.startDate).getDate()}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground uppercase">
                {new Date(registration.event.startDate).toLocaleDateString(locale, { month: "short" })}
              </span>
            </div>
            {/* Mobile-only: Status badge next to date */}
            <Badge 
              variant="outline" 
              className={`sm:hidden text-xs ${statusColors[registration.status] ?? ""}`}
            >
              {getStatusLabel(registration.status)}
            </Badge>
          </div>

          {/* Event Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <Link 
                  href={`/events/${registration.event.slug}`}
                  className="font-semibold hover:text-primary transition-colors line-clamp-2 sm:line-clamp-1 text-sm sm:text-base"
                >
                  {registration.event.title}
                </Link>
                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {new Date(registration.event.startDate).toLocaleTimeString(locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {registration.event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="truncate max-w-[150px] sm:max-w-none">{registration.event.location}</span>
                    </span>
                  )}
                </div>
              </div>
              {/* Desktop-only: Status badge */}
              <Badge 
                variant="outline" 
                className={`hidden sm:inline-flex shrink-0 ${statusColors[registration.status] ?? ""}`}
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

