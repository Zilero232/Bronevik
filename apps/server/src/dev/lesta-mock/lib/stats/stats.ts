import type { MockTotals } from '../../lesta-mock.types';
import type { AddBattleInput, AverageInput, MergeTotalsInput } from './stats.types';

export const emptyTotals = (): MockTotals => ({
  battles: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  damageDealt: 0,
  damageReceived: 0,
  frags: 0,
  spotted: 0,
  xp: 0,
  survived: 0,
  survivedWins: 0,
  hits: 0,
  shots: 0,
  piercings: 0,
  explosionHits: 0,
  directHitsReceived: 0,
  noDamageDirectHitsReceived: 0,
  piercingsReceived: 0,
  explosionHitsReceived: 0,
  capturePoints: 0,
  droppedCapturePoints: 0,
  damageBlocked: 0,
  assistedRadio: 0,
  assistedTrack: 0,
  stunAssisted: 0,
  stunNumber: 0,
  maxDamage: 0,
  maxFrags: 0,
  maxXp: 0
});

export const addBattle = ({ totals, battle }: AddBattleInput): void => {
  const won = battle.result === 'win';

  totals.battles += 1;
  totals.wins += won ? 1 : 0;
  totals.losses += battle.result === 'loss' ? 1 : 0;
  totals.draws += battle.result === 'draw' ? 1 : 0;
  totals.damageDealt += battle.damageDealt;
  totals.damageReceived += battle.damageReceived;
  totals.frags += battle.frags;
  totals.spotted += battle.spotted;
  totals.xp += battle.xp;
  totals.survived += battle.survived ? 1 : 0;
  totals.survivedWins += battle.survived && won ? 1 : 0;
  totals.hits += battle.hits;
  totals.shots += battle.shots;
  totals.piercings += battle.piercings;
  totals.explosionHits += battle.explosionHits;
  totals.directHitsReceived += battle.directHitsReceived;
  totals.noDamageDirectHitsReceived += battle.noDamageDirectHitsReceived;
  totals.piercingsReceived += Math.max(0, battle.directHitsReceived - battle.noDamageDirectHitsReceived);
  totals.capturePoints += battle.capturePoints;
  totals.droppedCapturePoints += battle.droppedCapturePoints;
  totals.damageBlocked += battle.damageBlocked;
  totals.assistedRadio += battle.assistedRadio;
  totals.assistedTrack += battle.assistedTrack;
  totals.stunAssisted += battle.stunAssisted;
  totals.stunNumber += battle.stunNumber;
  totals.maxDamage = Math.max(totals.maxDamage, battle.damageDealt);
  totals.maxFrags = Math.max(totals.maxFrags, battle.frags);
  totals.maxXp = Math.max(totals.maxXp, battle.xp);
};

const SUM_KEYS = [
  'battles',
  'wins',
  'losses',
  'draws',
  'damageDealt',
  'damageReceived',
  'frags',
  'spotted',
  'xp',
  'survived',
  'survivedWins',
  'hits',
  'shots',
  'piercings',
  'explosionHits',
  'directHitsReceived',
  'noDamageDirectHitsReceived',
  'piercingsReceived',
  'explosionHitsReceived',
  'capturePoints',
  'droppedCapturePoints',
  'damageBlocked',
  'assistedRadio',
  'assistedTrack',
  'stunAssisted',
  'stunNumber'
] as const satisfies readonly (keyof MockTotals)[];

const MAX_KEYS = ['maxDamage', 'maxFrags', 'maxXp'] as const satisfies readonly (keyof MockTotals)[];

export const mergeTotals = ({ target, source }: MergeTotalsInput): MockTotals => {
  for (const key of SUM_KEYS) {
    target[key] += source[key];
  }

  for (const key of MAX_KEYS) {
    target[key] = Math.max(target[key], source[key]);
  }

  return target;
};

export const sumTotals = (list: readonly MockTotals[]): MockTotals =>
  list.reduce((sum, totals) => mergeTotals({ target: sum, source: totals }), emptyTotals());

export const cloneTotals = (totals: MockTotals): MockTotals => ({ ...totals });

const average = ({ value, battles, digits = 2 }: AverageInput): number => (battles > 0 ? Number((value / battles).toFixed(digits)) : 0);

export const toStatsBlock = (totals: MockTotals) => ({
  battles: totals.battles,
  wins: totals.wins,
  losses: totals.losses,
  draws: totals.draws,
  xp: totals.xp,
  battle_avg_xp: Math.round(average({ value: totals.xp, battles: totals.battles })),
  damage_dealt: totals.damageDealt,
  damage_received: totals.damageReceived,
  frags: totals.frags,
  spotted: totals.spotted,
  capture_points: totals.capturePoints,
  dropped_capture_points: totals.droppedCapturePoints,
  hits: totals.hits,
  shots: totals.shots,
  hits_percents: totals.shots > 0 ? Math.round((totals.hits / totals.shots) * 100) : 0,
  survived_battles: totals.survived,
  piercings: totals.piercings,
  piercings_received: totals.piercingsReceived,
  explosion_hits: totals.explosionHits,
  explosion_hits_received: totals.explosionHitsReceived,
  direct_hits_received: totals.directHitsReceived,
  no_damage_direct_hits_received: totals.noDamageDirectHitsReceived,
  avg_damage_blocked: average({ value: totals.damageBlocked, battles: totals.battles }),
  avg_damage_assisted: average({ value: totals.assistedRadio + totals.assistedTrack, battles: totals.battles }),
  avg_damage_assisted_radio: average({ value: totals.assistedRadio, battles: totals.battles }),
  avg_damage_assisted_track: average({ value: totals.assistedTrack, battles: totals.battles }),
  avg_damage_assisted_stun: average({ value: totals.stunAssisted, battles: totals.battles }),
  stun_number: totals.stunNumber,
  stun_assisted_damage: totals.stunAssisted,
  tanking_factor:
    totals.damageBlocked + totals.damageReceived > 0 ? Number((totals.damageBlocked / (totals.damageBlocked + totals.damageReceived)).toFixed(2)) : 0
});
