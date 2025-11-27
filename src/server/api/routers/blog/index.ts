import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "./posts";
import { categoriesRouter } from "./categories";
import { tagsRouter } from "./tags";
import { commentsRouter } from "./comments";
import { newsletterRouter } from "./newsletter";

export const blogRouter = createTRPCRouter({
  posts: postsRouter,
  categories: categoriesRouter,
  tags: tagsRouter,
  comments: commentsRouter,
  newsletter: newsletterRouter,
});

