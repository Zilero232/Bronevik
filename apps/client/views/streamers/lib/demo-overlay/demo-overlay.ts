import type { OverlayData } from '@/shared/api/streamers';

import type { DemoOverlayInput } from './demo-overlay.types';

import { DEMO_CONFIG, DEMO_OVERLAY } from '../../config';

const DEMO_EPOCH = '2026-01-01T00:00:00.000Z';

const pick = <T>(items: readonly T[], index: number): T => items[index % items.length];

export const demoOverlayData = ({ tick, challengeTitle }: DemoOverlayInput): OverlayData => {
  const step = Math.abs(Math.trunc(tick)) % DEMO_OVERLAY.loop;
  const battles = DEMO_OVERLAY.battles + step;
  const wins = Math.min(battles, Math.round(battles * DEMO_OVERLAY.winShare) + (step % 2));
  const tankName = pick(DEMO_OVERLAY.tanks, step);
  const damage = pick(DEMO_OVERLAY.damage, step);

  return {
    kind: 'session',
    name: 'Demo',
    config: DEMO_CONFIG,
    player: null,
    session: {
      battles,
      wins,
      winRate: (wins / battles) * 100,
      avgDamage: DEMO_OVERLAY.avgDamage + step * 37,
      frags: battles + step,
      wn8: DEMO_OVERLAY.wn8 + step * 14,
      winStreak: step % 4,
      lastBattle: { tankId: step, tankName, result: step % 3 === 0 ? 'loss' : 'win', damage }
    },
    overall: null,
    moe: { tankName, marks: 2, percent: DEMO_OVERLAY.moePercent + step * 0.3 },
    challenge: {
      title: challengeTitle,
      code: DEMO_OVERLAY.code,
      status: 'active',
      battles: step % (DEMO_OVERLAY.challengeBattles + 1),
      battlesNeeded: DEMO_OVERLAY.challengeBattles,
      value: Math.min(DEMO_OVERLAY.challengeTarget, 600 + step * 260),
      target: DEMO_OVERLAY.challengeTarget
    },
    updatedAt: DEMO_EPOCH
  };
};

export const demoRecordingSeconds = (tick: number): number => DEMO_OVERLAY.startSeconds + Math.round((tick * DEMO_OVERLAY.tickMs) / 1_000);

export const formatRecordingClock = (seconds: number): string =>
  [Math.floor(seconds / 3_600), Math.floor((seconds % 3_600) / 60), seconds % 60].map((part) => String(part).padStart(2, '0')).join(':');
