import { MongoClient } from "https://deno.land/x/mongo@v0.21.0/mod.ts";

const client = new MongoClient();

const db = await client.connect("mongodb://mongoadmin:secret@localhost:27017");

export default db;
