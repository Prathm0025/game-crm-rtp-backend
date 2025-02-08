import Redis from "ioredis";
import { config } from "./config/config";

const redisUrl = config.redis_url;

if (!redisUrl) {
    throw new Error("REDIS_URL is not set in environment variables");
}

const pubClient = new Redis(redisUrl);
const subClient = pubClient.duplicate();

pubClient.on("connect", () => {
    console.log("✅ Connected to Redis successfully!");
});

pubClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

export { pubClient, subClient };
