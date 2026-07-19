// app/api/kofi-webhook/route.ts
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function POST(request: Request) {
  const formData = await request.formData();
  const rawData = formData.get("data");

  if (!rawData || typeof rawData !== "string") {
    return Response.json({ error: "Missing data" }, { status: 400 });
  }

  let payload: { verification_token?: string; type?: string };
  try {
    payload = JSON.parse(rawData);
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (payload.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (payload.type === "Tip") {
    // ← changed from "Donation"
    await redis.incr("kofi:coffee-count");
  }

  return Response.json({ success: true });
}
