import Redis from 'ioredis';
import "dotenv/config";

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    retryStrategy(times) {
        return Math.min(times * 500, 3000);
    }
})

redis.on("connect",()=>{
    console.log("Redis connected successfully");
})

redis.on("error",(error)=>{
    console.log("Radis error:" , error.message)
})

export default redis;


