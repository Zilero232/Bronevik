import RedisMock from 'ioredis-mock';
import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { PULSE } from '../../config';
import { decodeSample, encodeSample } from '../../lib/pulse-grid';
import { PulseService } from '../pulse.service';

const now = new Date('2026-09-25T12:00:00Z');
const dayMs = 86_400_000;

const createService = async () => {
  const prisma = mockDeep<PrismaService>();
  const redis = new RedisMock();

  await redis.del(PULSE.cacheKey, PULSE.samplesKey);
  prisma.$queryRaw.mockResolvedValue([{ dow: 5, hour: 20, players: 12 }]);
  prisma.player.count.mockResolvedValue(40);

  return { service: new PulseService(prisma, redis), prisma, redis };
};

describe('PulseService.view', () => {
  it('computes the view once and serves the cached copy without touching the database', async () => {
    const { service, prisma, redis } = await createService();

    const computed = await service.view(now);
    const fresh = mockDeep<PrismaService>();
    const cached = await new PulseService(fresh, redis).view(new Date(now.getTime() + 60_000));

    expect(cached).toEqual(computed);
    expect(prisma.player.count).toHaveBeenCalled();
    expect(fresh.$queryRaw).not.toHaveBeenCalled();
    expect(fresh.player.count).not.toHaveBeenCalled();
    expect(await redis.ttl(PULSE.cacheKey)).toBeGreaterThan(PULSE.cacheSeconds - 5);
  });

  it('recomputes when the cached value does not match the schema', async () => {
    const { service, prisma, redis } = await createService();

    await redis.set(PULSE.cacheKey, JSON.stringify({ stale: true }));

    const view = await service.view(now);

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(view.computedAt).toBe(now.toISOString());
    expect(view.bestHours[0]?.hour).toBe(20);
  });

  it('charts only the samples inside the series window', async () => {
    const { service, redis } = await createService();
    const inside = new Date(now.getTime() - (PULSE.seriesDays - 1) * dayMs);
    const outside = new Date(now.getTime() - (PULSE.seriesDays + 1) * dayMs);

    await redis.zadd(PULSE.samplesKey, outside.getTime(), encodeSample({ at: outside, players: 1 }));
    await redis.zadd(PULSE.samplesKey, inside.getTime(), encodeSample({ at: inside, players: 2 }));

    const view = await service.view(now);

    expect(view.series).toEqual([{ at: inside.toISOString(), players: 2 }]);
  });
});

describe('PulseService.sample', () => {
  it('stores the current active count and drops samples past the retention', async () => {
    const { service, redis } = await createService();
    const expired = new Date(now.getTime() - (PULSE.retentionDays + 1) * dayMs);
    const kept = new Date(now.getTime() - (PULSE.retentionDays - 1) * dayMs);

    await redis.zadd(PULSE.samplesKey, expired.getTime(), encodeSample({ at: expired, players: 5 }));
    await redis.zadd(PULSE.samplesKey, kept.getTime(), encodeSample({ at: kept, players: 6 }));

    expect(await service.sample(now)).toBe(40);

    const stored = (await redis.zrange(PULSE.samplesKey, 0, -1)).map((member) => decodeSample(member));

    expect(stored).toEqual([
      { at: kept, players: 6 },
      { at: now, players: 40 }
    ]);
  });
});
