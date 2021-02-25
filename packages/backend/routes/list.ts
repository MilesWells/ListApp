import { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { v4 } from "https://deno.land/std@0.88.0/uuid/mod.ts";

type ListStore = {
  [listId: string]: string[];
};

const store: ListStore = {};

function getLists(ctx: RouterContext) {
  ctx.response.body = store;
}

function getList(ctx: RouterContext) {
  const id = ctx.params.id;

  if (id === undefined) {
    ctx.response.status = 404;
    return;
  }

  ctx.response.body = store[id];
}

async function createList(ctx: RouterContext) {
  const list: string[] = await ctx.request.body().value;
  const newId = v4.generate();

  store[newId] = list;

  ctx.response.status = 201;
  ctx.response.body = list;
}

export function buildListRoutes(router: Router) {
  router
    .get("/lists", getLists)
    .get("/lists/:id", getList)
    .post("/lists", createList);
}
