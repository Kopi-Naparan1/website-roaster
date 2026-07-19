// app/api/coffee-count/route.ts
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET() {
  const count = (await redis.get<number>("kofi:coffee-count")) ?? 0;
  return Response.json({ count });
}
