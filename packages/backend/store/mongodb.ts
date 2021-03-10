import { MongoClient } from "../deps.ts";

const client = new MongoClient();

const db = await client.connect("mongodb://mongoadmin:secret@localhost:27017");

export default db;
