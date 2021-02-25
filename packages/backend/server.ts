import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import { buildRouter } from "./router.ts";

const router = buildRouter();
const app = new Application();
const port = 8000;
app.use(
  oakCors({
    origin: "http://localhost:3000",
  })
);
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port });
console.log(`Server is running on port ${port}`);
