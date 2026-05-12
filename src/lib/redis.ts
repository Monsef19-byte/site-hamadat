import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error('REDIS_URL is not set');
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
    });
  }
  return redis;
}
