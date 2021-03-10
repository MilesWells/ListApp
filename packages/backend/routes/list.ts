import { Bson, Router, RouterContext } from "../deps.ts";

import db from "../store/mongodb.ts";

interface ListSchema {
  _id: { $oid: string };
  items: string[];
  name: string;
}

type ListPayload = Omit<ListSchema, "_id">;

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

  const found = await listCollection.findOne({ _id: new Bson.ObjectId(id) });

  if (found === undefined) {
    ctx.response.status = 404;
    return;
  }

  ctx.response.body = found;
}

async function createList(ctx: RouterContext) {
  const list: ListPayload = JSON.parse(await ctx.request.body().value);

  try {
    const documentId = await listCollection.insertOne(list);

    ctx.response.status = 201;
    ctx.response.body = documentId;
  } catch (err) {
    console.error(err);
    ctx.response.status = 500;
    ctx.response.body = err;
  }
}

async function deleteList(ctx: RouterContext) {
  const id = ctx.params.id;

  if (id === undefined) {
    ctx.response.status = 404;
    ctx.response.body = "No id provided";
    return;
  }

  try {
    const count = await listCollection.deleteOne({
      _id: new Bson.ObjectId(id),
    });

    ctx.response.status = count === 0 ? 404 : 204;
    if (count === 0) ctx.response.body = "Id not found";
  } catch (err) {
    console.error(err);
    ctx.response.status = 500;
    ctx.response.body = err;
  }
}

async function updateList(ctx: RouterContext) {
  const id = ctx.params.id;

  if (id === undefined) {
    ctx.response.status = 404;
    ctx.response.body = "No id provided";
    return;
  }

  const list: ListPayload = JSON.parse(await ctx.request.body().value);

  try {
    const { upsertedId } = await listCollection.updateOne(
      { _id: new Bson.ObjectId(id) },
      { $set: list }
    );

    ctx.response.status = 200;
    ctx.response.body = upsertedId;
  } catch (err) {
    console.error(err);
    ctx.response.status = 500;
    ctx.response.body = err;
  }
}

export function buildListRoutes(router: Router) {
  router
    .get("/lists", getLists)
    .get("/lists/:id", getList)
    .post("/lists", createList)
    .delete("/lists/:id", deleteList)
    .put("/lists/:id", updateList);
}
