import { Bson, Router, RouterContext } from "../deps.ts";

import db from "../store/mongodb.ts";

interface TodoListSchema {
  _id: { $oid: string };
  items: {
    checked: boolean;
    item: string;
  }[];
  userId: string;
}

type TodoListPayload = Omit<TodoListSchema, "_id">;

const todoListCollection = db.collection<TodoListSchema>("todo-lists");

async function getTodoList(ctx: RouterContext) {
  const id = ctx.params.id;

  if (id === undefined) {
    ctx.response.status = 404;
    return;
  }

  const found = await todoListCollection.findOne({
    _id: new Bson.ObjectId(id),
  });

  if (found === undefined) {
    ctx.response.status = 404;
    return;
  }

  ctx.response.body = found;
}

async function createTodoList(ctx: RouterContext) {
  const userId = ctx.params.id;

  if (userId === undefined) {
    ctx.response.status = 400;
    ctx.response.body = "id is required";
    return;
  }

  const found = await todoListCollection.findOne({ userId });

  if (found !== undefined) {
    ctx.response.status = 400;
    ctx.response.body = "User already has a todo list";
    return;
  }

  try {
    const documentId = await todoListCollection.insertOne({
      items: [],
      userId,
    });

    ctx.response.status = 201;
    ctx.response.body = documentId;
  } catch (err) {
    console.error(err);
    ctx.response.status = 500;
    ctx.response.body = err;
  }
}

async function updateList(ctx: RouterContext) {
  const userId = ctx.params.id;

  if (userId === undefined) {
    ctx.response.status = 404;
    ctx.response.body = "No userId provided";
    return;
  }

  const todoList: TodoListPayload = JSON.parse(await ctx.request.body().value);

  try {
    const { upsertedId } = await todoListCollection.updateOne(
      { userId },
      { $set: todoList }
    );

    ctx.response.status = 200;
    ctx.response.body = upsertedId;
  } catch (err) {
    console.error(err);
    ctx.response.status = 500;
    ctx.response.body = err;
  }
}

export function buildTodoListRoutes(router: Router) {
  router
    .get("/todo/:id", getTodoList)
    .post("/todo", createTodoList)
    .put("/todo/:id", updateList);
}
