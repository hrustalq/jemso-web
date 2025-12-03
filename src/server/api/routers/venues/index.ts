import { createTRPCRouter } from "~/server/api/trpc";
import { venuesRouter } from "./venues";

export const venueRouter = createTRPCRouter({
  venues: venuesRouter,
});

