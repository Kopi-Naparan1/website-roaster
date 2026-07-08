import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/app/lib/redis";

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 m"),
  analytics: true,
  prefix: "roast",
});
