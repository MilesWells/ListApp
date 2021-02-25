import { Router } from "https://deno.land/x/oak/mod.ts";

import { buildListRoutes } from "./routes/list.ts";

export function buildRouter() {
  const router = new Router();
  buildListRoutes(router);

  return router;
}
