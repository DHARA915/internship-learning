
import redis from "../config/redis.js";

const QUEUE_KEY = "notifications:queue";

const listService = {
    async addToStart(message) {
        return await redis.lpush(QUEUE_KEY, message);
    },

    async addToEnd(message) {
        return await redis.rpush(QUEUE_KEY, message);
    },

    async getAll() {
        return await redis.lrange(QUEUE_KEY, 0, -1);
    },

    async getLength() {
        return await redis.llen(QUEUE_KEY);
    },

    async removeFirst() {
        return await redis.lpop(QUEUE_KEY);
    },

    async removeLast() {
        return await redis.rpop(QUEUE_KEY);
    },

    async getByIndex(index) {
        return await redis.lindex(QUEUE_KEY, index);
    },

    async removeMessage(count, message) {
        return await redis.lrem(QUEUE_KEY, count, message);
    }
};

export default listService;
