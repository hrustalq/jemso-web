import { createTRPCRouter } from "~/server/api/trpc";
import { newsRouter } from "./news";

export const newsIndexRouter = createTRPCRouter({
  posts: newsRouter, // We can expose it as api.news.posts or just api.news
});

