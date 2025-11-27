import { format } from "date-fns";
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
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Registrations</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              No events found. Create your first event!
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
                  {format(new Date(event.startDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(event.endDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge variant={event.published ? "default" : "secondary"}>
                      {event.published ? "Published" : "Draft"}
                    </Badge>
                    {isUpcoming && (
                      <Badge variant="outline" className="bg-blue-500/10">
                        Upcoming
                      </Badge>
                    )}
                    {isPast && (
                      <Badge variant="outline" className="bg-gray-500/10">
                        Past
                      </Badge>
                    )}
                    {isFull && (
                      <Badge variant="outline" className="bg-red-500/10">
                        Full
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
                      Free
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

