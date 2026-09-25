import type { Prisma, SkillCohort, StatsMode } from '../../../../../../generated';
import type { BattleStatsBlock, TankStats } from '../../../../../lib/lesta';

export type SnapshotMode = Extract<StatsMode, 'all' | 'random'>;

export type ModeBlock = {
  mode: SnapshotMode;
  block: BattleStatsBlock;
};

export type BlockSource = {
  all: BattleStatsBlock;
  random?: BattleStatsBlock;
};

export type AccountSnapshotRowInput = {
  accountId: bigint;
  capturedAt: Date;
  mode: SnapshotMode;
  block: BattleStatsBlock;
  globalRating: number | null;
};

export type TankSnapshotRowInput = {
  accountId: bigint;
  capturedAt: Date;
  mode: SnapshotMode;
  block: BattleStatsBlock;
  stats: Pick<TankStats, 'mark_of_mastery' | 'max_frags' | 'max_xp' | 'tank_id'>;
  marksOnGun?: number | null;
};

export type ShouldWriteSnapshotInput = {
  previous: { battles: number } | null | undefined;
  battles: number;
};

export type TankSnapshotRow = Prisma.TankSnapshotCreateManyInput;

export type TankDeltaInput = {
  previous: TankSnapshotRow | null | undefined;
  current: TankSnapshotRow;
  cohort: SkillCohort;
  accountWinRate: number;
  tier: number | null;
};

export type BlockFields = {
  battles: number;
  wins: number;
  losses: number;
  draws: number;
  damageDealt: number;
  damageReceived: number;
  frags: number;
  spotted: number;
  xp: number;
  battleAvgXp: number;
  survived: number;
  hits: number;
  shots: number;
  piercings: number;
  piercingsReceived: number;
  explosionHits: number;
  directHitsReceived: number;
  noDamageDirectHitsReceived: number;
  capturePoints: number;
  droppedCapturePoints: number;
  avgDamageBlocked: number;
  tankingFactor: number | null;
  stunAssistedDamage: number;
  stunNumber: number;
};
