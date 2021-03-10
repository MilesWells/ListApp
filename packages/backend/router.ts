import { Router } from "./deps.ts";

import { buildListRoutes, buildTodoListRoutes } from "./routes/index.ts";

export function buildRouter() {
  const router = new Router();

  buildListRoutes(router);
  buildTodoListRoutes(router);

  return router;
}
