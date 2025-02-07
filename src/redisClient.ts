import Redis from "ioredis";
import { config } from "./config/config";
const redisUrl = config.redis_url

if (!redisUrl) {
    throw new Error("REDIS_URL environment variable is not set");
}

const pubClient = new Redis(redisUrl);

pubClient.on('connect', () => {
    console.log('Connected to Redis on Render successfully!');
});

pubClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default pubClient;
