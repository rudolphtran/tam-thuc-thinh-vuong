import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "tam-thuc-thinh-vuong";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

function getMongoTarget(uri: string) {
  try {
    const normalized = uri.startsWith("mongodb://")
      ? uri.replace("mongodb://", "http://")
      : uri.replace("mongodb+srv://", "https://");
    const parsed = new URL(normalized);
    return {
      host: parsed.host,
      database: parsed.pathname.replace(/^\//, "") || "(default)",
    };
  } catch {
    return {
      host: "(unparsed)",
      database: "(unparsed)",
    };
  }
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.__mongoose ?? { conn: null, promise: null };
global.__mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const parsedTarget = getMongoTarget(MONGODB_URI);
    const target = {
      ...parsedTarget,
      database: MONGODB_DB_NAME,
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        dbName: MONGODB_DB_NAME,
      })
      .then((mg) => {
        console.info("MongoDB connected", target);
        return mg;
      })
      .catch((err: unknown) => {
        const error = err as { name?: string; message?: string; code?: string | number };
        console.error("MongoDB connection error", {
          ...target,
          name: error?.name,
          message: error?.message,
          code: error?.code,
        });
        throw err;
      })
      .then((mg) => mg);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
