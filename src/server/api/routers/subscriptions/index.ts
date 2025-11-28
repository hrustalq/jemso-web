import { createTRPCRouter } from "~/server/api/trpc";
import { plansRouter } from "./plans";
import { featuresRouter } from "./features";
import { subscriptionsRouter as userSubscriptionsRouter } from "./subscriptions";
import { checkoutRouter } from "./checkout";

export const subscriptionsRouter = createTRPCRouter({
  plans: plansRouter,
  features: featuresRouter,
  subscriptions: userSubscriptionsRouter,
  checkout: checkoutRouter,
});

