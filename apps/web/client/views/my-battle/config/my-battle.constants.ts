import type { BattleAnalysis, MyBattle } from '@otmetki/schemas';

export const MY_BATTLE = {
  skeletonHeight: 360,
  analysisSkeletonHeight: 420,
  percentScale: 100
} as const;

export const BATTLE_FACTS = [
  'damageDealt',
  'damageAssisted',
  'damageBlocked',
  'frags',
  'spotted',
  'xp',
  'credits'
] as const satisfies readonly (keyof MyBattle)[];

export const DAMAGE_BREAKDOWN = [
  'dealt',
  'assistedRadio',
  'assistedTrack',
  'assistedStun',
  'blocked'
] as const satisfies readonly (keyof BattleAnalysis['breakdown'])[];

export const EFFICIENCY_KEYS = ['damage', 'assisted', 'spotted', 'frags'] as const satisfies readonly (keyof BattleAnalysis['efficiency'])[];

export const EFFICIENCY_TONES = [
  { from: 1.6, tone: 'unicum' },
  { from: 1.3, tone: 'great' },
  { from: 1.1, tone: 'good' },
  { from: 0.9, tone: 'average' },
  { from: 0.7, tone: 'below' },
  { from: Number.NEGATIVE_INFINITY, tone: 'bad' }
] as const;
