import Redis from 'ioredis';

const getRedis = () => {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error('REDIS_URL is not set');
  return new Redis(url);
};

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) redis = getRedis();
  return redis;
}
