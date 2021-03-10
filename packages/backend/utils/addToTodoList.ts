import { Bson } from "../deps.ts";
import { TodoListSchema, ListSchema } from "../types.ts";
import db from "../store/mongodb.ts";

const todoListCollection = db.collection<TodoListSchema>("todo-lists");
const listCollection = db.collection<ListSchema>("lists");

export async function addToTodoList(listId: string, todoListId: string) {
  const list = await listCollection.findOne({
    _id: new Bson.ObjectId(listId),
  });

  if (list === undefined) throw new Error(`List id ${listId} not found`);

  const todoList = await todoListCollection.findOne({
    _id: new Bson.ObjectId(todoListId),
  });

  if (todoList === undefined)
    throw new Error(`Todo List id ${listId} not found`);

  const newItems: TodoListSchema["items"] = list.items.map((item) => ({
    checked: false,
    item,
  }));

  const updatedItems = [...todoList.items, ...newItems];

  const { upsertedId } = await todoListCollection.updateOne(
    { _id: new Bson.ObjectId(todoListId) },
    {
      $set: {
        items: updatedItems,
      },
    }
  );

  return upsertedId;
}
