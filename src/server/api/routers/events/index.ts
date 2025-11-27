import { createTRPCRouter } from "~/server/api/trpc";
import { eventsRouter } from "./events";
import { registrationsRouter } from "./registrations";

export const eventRouter = createTRPCRouter({
  events: eventsRouter,
  registrations: registrationsRouter,
});

