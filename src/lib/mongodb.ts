import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "swp_finance";

type MongoCache = {
  client: MongoClient;
  promise: Promise<MongoClient>;
};

declare global {
  // eslint-disable-next-line no-var
  var __swpMongo: MongoCache | undefined;
}

export function isMongoConfigured() {
  return Boolean(uri);
}

export async function getMongoDb() {
  if (!uri) return null;

  if (!global.__swpMongo) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    global.__swpMongo = {
      client,
      promise: client.connect(),
    };
  }

  const client = await global.__swpMongo.promise;
  return client.db(dbName);
}
