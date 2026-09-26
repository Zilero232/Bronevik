import type { PlayerProfile, Session, SessionBattle, StatsBlock, VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { PREVIEW_OVERLAY_CONFIG } from '../../../config';
import { previewOverlayData } from '../preview-overlay';

const stats = (battles: number, overrides: Partial<StatsBlock> = {}): StatsBlock => ({
  battles,
  winRate: 60,
  avgDamage: 3000,
  avgFrags: 1.5,
  avgSpotted: null,
  avgXp: null,
  avgBlocked: null,
  avgAssisted: null,
  survivalRate: null,
  accuracy: null,
  avgTier: null,
  wn8: { value: 3100, tier: null },
  eff: { value: null, tier: null },
  broneIndex: { value: 1800, tier: null },
  ...overrides
});

const profile: PlayerProfile = {
  summary: {
    accountId: 7,
    nickname: 'Top_Player',
    clan: null,
    createdAt: null,
    lastBattleAt: null,
    updatedAt: '2026-09-26T10:00:00.000Z',
    isTracked: true,
    overall: stats(20_000, { winRate: 58 }),
    marks: { moe3: 1, moe2: 1, moe1: 1, mastery: 1, tanksOwned: 10 }
  },
  recent: [
    { period: '24h', from: null, to: null, stats: stats(0) },
    { period: '7d', from: null, to: null, stats: stats(40, { winRate: 55 }) }
  ]
};

const vehicle: VehicleSummary = {
  tankId: 1,
  name: 'Объект 140',
  shortName: 'Об. 140',
  slug: 'object-140',
  nation: 'ussr',
  type: 'mediumTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  images: { small: null, contour: null, big: null }
};

const battle = (startedAt: string, overrides: Partial<SessionBattle> = {}): SessionBattle => ({
  id: '00000000-0000-4000-8000-000000000001',
  arenaUniqueId: '1',
  vehicle,
  arenaId: 'himmelsdorf',
  mapName: 'Химмельсдорф',
  battleType: 'random',
  result: 'win',
  survived: true,
  damageDealt: 4200,
  damageAssisted: 0,
  damageBlocked: 0,
  spotted: 0,
  frags: 1,
  xp: 1000,
  credits: null,
  moePercent: null,
  moePercentDelta: null,
  queueTimeSec: null,
  durationSec: null,
  shots: null,
  startedAt,
  ...overrides
});

const session = (battles: SessionBattle[]): Session => ({
  id: '00000000-0000-4000-8000-000000000002',
  accountId: 7,
  kind: 'live',
  source: 'mod',
  isLive: true,
  day: null,
  startedAt: '2026-09-26T09:00:00.000Z',
  endedAt: null,
  stats: stats(battles.length),
  credits: null,
  tanks: [],
  battles,
  best: null,
  worst: null
});

describe('previewOverlayData', () => {
  it('falls back to the latest non-empty recent period without a session', () => {
    const data = previewOverlayData({ profile, session: null, config: PREVIEW_OVERLAY_CONFIG });

    expect(data.session).toMatchObject({ battles: 40, wins: 22, winRate: 55, frags: 60, wn8: 3100, lastBattle: null });
    expect(data.overall).toEqual({ battles: 20_000, winRate: 58, wn8: 3100, broneIndex: 1800 });
    expect(data.moe).toBeNull();
    expect(data.updatedAt).toBe(profile.summary.updatedAt);
  });

  it('reads the session, its last battle and the latest MoE reading', () => {
    const data = previewOverlayData({
      profile,
      session: session([
        battle('2026-09-26T09:00:00.000Z', { moePercent: 86.4 }),
        battle('2026-09-26T09:20:00.000Z', { result: 'loss', damageDealt: 1500 })
      ]),
      config: PREVIEW_OVERLAY_CONFIG
    });

    expect(data.session?.battles).toBe(2);
    expect(data.session?.lastBattle).toEqual({ tankId: 1, tankName: 'Объект 140', result: 'loss', damage: 1500 });
    expect(data.moe).toEqual({ tankName: 'Объект 140', marks: 2, percent: 86.4 });
  });
});
