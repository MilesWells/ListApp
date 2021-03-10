export interface ListSchema {
  _id: { $oid: string };
  items: string[];
  name: string;
}

export type ListPayload = Omit<ListSchema, "_id">;

export interface TodoListSchema {
  _id: { $oid: string };
  items: {
    checked: boolean;
    item: string;
  }[];
  userId: string;
}

export type TodoListPayload = Omit<TodoListSchema, "_id">;
