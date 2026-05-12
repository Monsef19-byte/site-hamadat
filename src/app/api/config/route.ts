import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

const CONFIG_KEY = 'hamadat-site-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const redis = getRedisClient();
    const raw = await redis.get(CONFIG_KEY);
    if (raw) {
      return NextResponse.json(JSON.parse(raw));
    }
    return NextResponse.json(null);
  } catch (e: unknown) {
    console.error('GET /api/config error:', e);
    return NextResponse.json(null, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const redis = getRedisClient();
    await redis.set(CONFIG_KEY, JSON.stringify(body));
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error('POST /api/config error:', e);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
