import type { OverlayData, SessionBattle, StatsBlock } from '@otmetki/schemas';

import { firstBy } from 'remeda';

import type { PreviewOverlayInput } from './preview-overlay.types';

import { PREVIEW_OVERLAY } from '../../config';

const marksOf = (percent: number): number => PREVIEW_OVERLAY.marks.find((step) => percent >= step.percent)?.marks ?? 0;

const latest = (battles: readonly SessionBattle[]): SessionBattle | null => firstBy(battles, [(battle) => battle.startedAt, 'desc']) ?? null;

const recentStats = ({ recent }: PreviewOverlayInput['profile']): StatsBlock | null =>
  PREVIEW_OVERLAY.recentPeriods
    .map((period) => recent.find((entry) => entry.period === period)?.stats ?? null)
    .find((stats) => stats !== null && stats.battles > 0) ?? null;

export const previewOverlayData = ({ profile, session, config }: PreviewOverlayInput): OverlayData => {
  const { summary } = profile;
  const stats = session && session.stats.battles > 0 ? session.stats : (recentStats(profile) ?? summary.overall);
  const battles = session?.battles ?? [];
  const last = latest(battles);
  const moe = latest(battles.filter((battle) => battle.moePercent !== null));

  return {
    kind: 'session',
    name: summary.nickname,
    config,
    isPaused: false,
    player: { accountId: summary.accountId, nickname: summary.nickname },
    session: {
      battles: stats.battles,
      wins: Math.round((stats.battles * (stats.winRate ?? 0)) / 100),
      winRate: stats.winRate,
      avgDamage: stats.avgDamage,
      frags: Math.round(stats.battles * (stats.avgFrags ?? 0)),
      wn8: stats.wn8.value,
      broneIndex: stats.broneIndex.value,
      winStreak: 0,
      lastBattle: last && { tankId: last.vehicle.tankId, tankName: last.vehicle.name, result: last.result, damage: last.damageDealt }
    },
    overall: {
      battles: summary.overall.battles,
      winRate: summary.overall.winRate,
      wn8: summary.overall.wn8.value,
      broneIndex: summary.overall.broneIndex.value
    },
    moe: moe === null || moe.moePercent === null ? null : { tankName: moe.vehicle.name, marks: marksOf(moe.moePercent), percent: moe.moePercent },
    challenge: null,
    updatedAt: summary.updatedAt
  };
};
