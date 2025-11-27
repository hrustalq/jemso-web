import { createTRPCRouter } from "~/server/api/trpc";
import { rolesRouter } from "./roles";
import { permissionsRouter } from "./permissions";

export const rbacRouter = createTRPCRouter({
  roles: rolesRouter,
  permissions: permissionsRouter,
});

