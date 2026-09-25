import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import type { ActivityRow } from '../lib/pulse-grid';
import type { PulseView } from '../pulse.types';

import { PrismaService, REDIS } from '../../../core';
import { PULSE } from '../config';
import { pulseSchema } from '../dto';
import { activityGrid, bestHours, decodeSample, encodeSample } from '../lib/pulse-grid';

@Injectable()
export class PulseService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis
  ) {}

  async view(now: Date): Promise<PulseView> {
    const cached = await this.redis.get(PULSE.cacheKey);
    const parsed = cached ? pulseSchema.safeParse(JSON.parse(cached)) : null;

    if (parsed?.success) {
      return parsed.data;
    }

    const since = new Date(now.getTime() - PULSE.heatmapDays * 86_400_000);
    const activeSince = new Date(now.getTime() - PULSE.activeWindowMinutes * 60_000);
    const [rows, activePlayers, trackedPlayers, members] = await Promise.all([
      this.prisma.$queryRaw<ActivityRow[]>`
        SELECT EXTRACT(ISODOW FROM last_battle_at AT TIME ZONE ${PULSE.timezone})::int AS dow,
               EXTRACT(HOUR FROM last_battle_at AT TIME ZONE ${PULSE.timezone})::int AS hour,
               COUNT(*)::int AS players
        FROM player
        WHERE last_battle_at >= ${since} AND last_battle_at <= ${now}
        GROUP BY 1, 2
      `,
      this.prisma.player.count({ where: { lastBattleAt: { gte: activeSince, lte: now } } }),
      this.prisma.player.count({ where: { lastBattleAt: { gte: since } } }),
      this.redis.zrangebyscore(PULSE.samplesKey, now.getTime() - PULSE.seriesDays * 86_400_000, now.getTime())
    ]);

    const heatmap = activityGrid(rows);
    const view: PulseView = {
      timezone: PULSE.timezone,
      since: since.toISOString(),
      activePlayers,
      trackedPlayers,
      heatmap,
      bestHours: bestHours({ grid: heatmap, count: PULSE.bestHours }),
      series: members.flatMap((member) => {
        const sample = decodeSample(member);

        return sample ? [{ at: sample.at.toISOString(), players: sample.players }] : [];
      }),
      computedAt: now.toISOString()
    };

    await this.redis.set(PULSE.cacheKey, JSON.stringify(view), 'EX', PULSE.cacheSeconds);

    return view;
  }

  async sample(now: Date): Promise<number> {
    const players = await this.prisma.player.count({
      where: { lastBattleAt: { gte: new Date(now.getTime() - PULSE.activeWindowMinutes * 60_000), lte: now } }
    });

    await this.redis
      .multi()
      .zadd(PULSE.samplesKey, now.getTime(), encodeSample({ at: now, players }))
      .zremrangebyscore(PULSE.samplesKey, 0, now.getTime() - PULSE.retentionDays * 86_400_000)
      .exec();

    return players;
  }
}
