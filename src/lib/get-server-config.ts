import { getRedisClient } from './redis';

// Server-side config fetcher — used in SiteConfigProvider's initial value
export async function getServerConfig() {
  try {
    const redis = getRedisClient();
    const raw = await redis.get('hamadat-site-config');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('getServerConfig error:', e);
  }
  return null;
}
