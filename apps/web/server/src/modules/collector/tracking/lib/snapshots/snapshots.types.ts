import type { Prisma, SkillCohort, StatsMode, TankSnapshot } from '../../../../../../generated';
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
};

export type BlockFields = Pick<
  TankSnapshot,
  | 'avgDamageBlocked'
  | 'battles'
  | 'capturePoints'
  | 'damageDealt'
  | 'damageReceived'
  | 'draws'
  | 'droppedCapturePoints'
  | 'frags'
  | 'hits'
  | 'losses'
  | 'shots'
  | 'spotted'
  | 'survived'
  | 'wins'
  | 'xp'
>;

export type BlockedTotalInput = {
  avgDamageBlocked: number;
  battles: number;
};
