import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";
import { EventActions } from "./event-actions";

export async function EventList() {
  const { items: events } = await api.event.events.list({
    page: 1,
    pageSize: 50,
    published: undefined,
  });

  const now = new Date();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Дата начала</TableHead>
          <TableHead>Дата окончания</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Регистрации</TableHead>
          <TableHead>Цена</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              События не найдены. Создайте первое событие!
            </TableCell>
          </TableRow>
        ) : (
          events.map((event) => {
            const isUpcoming = new Date(event.startDate) > now;
            const isPast = new Date(event.endDate) < now;
            const isFull = event.maxParticipants
              ? event._count.registrations >= event.maxParticipants
              : false;

            return (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  {event.category ? (
                    <Badge variant="outline">{event.category.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(event.startDate), "d MMM yyyy", { locale: ru })}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(event.endDate), "d MMM yyyy", { locale: ru })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge variant={event.published ? "default" : "secondary"}>
                      {event.published ? "Опубликовано" : "Черновик"}
                    </Badge>
                    {isUpcoming && (
                      <Badge variant="outline" className="bg-blue-500/10">
                        Предстоящее
                      </Badge>
                    )}
                    {isPast && (
                      <Badge variant="outline" className="bg-gray-500/10">
                        Прошедшее
                      </Badge>
                    )}
                    {isFull && (
                      <Badge variant="outline" className="bg-red-500/10">
                        Заполнено
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {event._count.registrations}
                    </span>
                    {event.maxParticipants && (
                      <span className="text-muted-foreground">
                        / {event.maxParticipants}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {event.price.toNumber() === 0 ? (
                    <Badge variant="outline" className="bg-green-500/10">
                      Бесплатно
                    </Badge>
                  ) : (
                    <span className="font-medium">
                      ${event.price.toString()} {event.currency}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <EventActions
                    eventId={event.id}
                    eventTitle={event.title}
                    eventSlug={event.slug}
                  />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
