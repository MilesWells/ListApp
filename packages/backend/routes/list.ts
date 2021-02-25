import { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";

import db from "../store/mongodb.ts";

interface ListSchema {
  _id: { $oid: string };
  items: string[];
}

const listCollection = db.collection<ListSchema>("lists");

async function getLists(ctx: RouterContext) {
  ctx.response.body = await listCollection.find().toArray();
}

async function getList(ctx: RouterContext) {
  const id = ctx.params.id;

  if (id === undefined) {
    ctx.response.status = 404;
    return;
  }

  const found = await listCollection.findOne({ _id: id });

  if (found === undefined) {
    ctx.response.status = 404;
    return;
  }

  ctx.response.body = found;
}

async function createList(ctx: RouterContext) {
  const list: string[] = await ctx.request.body().value;
  try {
    const documentId = await listCollection.insertOne({
      items: list,
    });

    ctx.response.status = 201;
    ctx.response.body = documentId;
  } catch (err) {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.body = err;
  }
}

export function buildListRoutes(router: Router) {
  router
    .get("/lists", getLists)
    .get("/lists/:id", getList)
    .post("/lists", createList);
}
