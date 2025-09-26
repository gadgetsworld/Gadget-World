import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable")
}

let client: MongoClient | null = null
let promise: Promise<MongoClient> | null = null

export async function getMongoClient() {
  if (client) return client
  if (!promise) {
    const c = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
    promise = c.connect().then((conn) => {
      client = conn
      return conn
    })
  }
  return promise
}

export async function getDb(dbName = "gadgets_world") {
  const c = await getMongoClient()
  return c.db(dbName)
}
