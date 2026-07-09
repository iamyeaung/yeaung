import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Fallback to a dummy client if env vars are missing to prevent crash during build/dev
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = (redisUrl && redisToken)
  ? new Redis({ url: redisUrl, token: redisToken })
  : new Redis({ url: "https://dummy.upstash.io", token: "dummy" });

// Create a ratelimiter that allows 5 requests per 1 minute
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  // Disable throwing on empty env var since we handle it gracefully below
  ephemeralCache: new Map(),
});
