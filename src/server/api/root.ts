import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "~/server/api/routers/auth";
import { blogRouter } from "~/server/api/routers/blog";
import { newsIndexRouter } from "~/server/api/routers/news";
import { eventRouter } from "~/server/api/routers/events";
import { rbacRouter } from "~/server/api/routers/rbac";
import { subscriptionsRouter } from "~/server/api/routers/subscriptions";
import { userRouter } from "~/server/api/routers/user";
import { venueRouter } from "~/server/api/routers/venues";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  blog: blogRouter,
  news: newsIndexRouter,
  event: eventRouter,
  venue: venueRouter,
  rbac: rbacRouter,
  subscriptions: subscriptionsRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
