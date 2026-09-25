import type { Prisma } from '../../../../../../generated';
import type { BattleStatsBlock } from '../../../../../lib/lesta';
import type {
  AccountSnapshotRowInput,
  BlockFields,
  BlockSource,
  ModeBlock,
  ShouldWriteSnapshotInput,
  SnapshotMode,
  TankDeltaInput,
  TankSnapshotRowInput
} from './snapshots.types';

export const modeBlocks = (source: BlockSource): ModeBlock[] => {
  const blocks: ModeBlock[] = [{ mode: 'all', block: source.all }];

  if (source.random) {
    blocks.push({ mode: 'random', block: source.random });
  }

  return blocks;
};

export const shouldWriteSnapshot = ({ previous, battles }: ShouldWriteSnapshotInput): boolean => !previous || previous.battles !== battles;

const blockFields = (block: BattleStatsBlock): BlockFields => ({
  battles: block.battles,
  wins: block.wins,
  losses: block.losses,
  draws: block.draws,
  damageDealt: block.damage_dealt,
  damageReceived: block.damage_received,
  frags: block.frags,
  spotted: block.spotted,
  xp: block.xp,
  battleAvgXp: block.battle_avg_xp ?? 0,
  survived: block.survived_battles,
  hits: block.hits,
  shots: block.shots,
  piercings: block.piercings ?? 0,
  piercingsReceived: block.piercings_received ?? 0,
  explosionHits: block.explosion_hits ?? 0,
  directHitsReceived: block.direct_hits_received ?? 0,
  noDamageDirectHitsReceived: block.no_damage_direct_hits_received ?? 0,
  capturePoints: block.capture_points,
  droppedCapturePoints: block.dropped_capture_points,
  avgDamageBlocked: block.avg_damage_blocked ?? 0,
  tankingFactor: block.tanking_factor ?? null,
  stunAssistedDamage: block.stun_assisted_damage ?? 0,
  stunNumber: block.stun_number ?? 0
});

export const accountSnapshotRow = ({
  accountId,
  capturedAt,
  mode,
  block,
  globalRating
}: AccountSnapshotRowInput): Prisma.AccountSnapshotCreateManyInput => {
  const fields = blockFields(block);

  return {
    ...fields,
    accountId,
    mode,
    capturedAt,
    damageDealt: BigInt(fields.damageDealt),
    damageReceived: BigInt(fields.damageReceived),
    xp: BigInt(fields.xp),
    stunAssistedDamage: BigInt(fields.stunAssistedDamage),
    explosionHitsReceived: block.explosion_hits_received ?? null,
    avgDamageAssisted: block.avg_damage_assisted ?? null,
    avgDamageAssistedRadio: block.avg_damage_assisted_radio ?? null,
    avgDamageAssistedTrack: block.avg_damage_assisted_track ?? null,
    maxDamage: block.max_damage ?? null,
    maxDamageTankId: block.max_damage_tank_id ?? null,
    maxFrags: block.max_frags ?? null,
    maxFragsTankId: block.max_frags_tank_id ?? null,
    maxXp: block.max_xp ?? null,
    maxXpTankId: block.max_xp_tank_id ?? null,
    globalRating
  };
};

export const tankSnapshotRow = ({
  accountId,
  capturedAt,
  mode,
  block,
  stats,
  marksOnGun
}: TankSnapshotRowInput): Prisma.TankSnapshotCreateManyInput => ({
  ...blockFields(block),
  accountId,
  tankId: stats.tank_id,
  mode,
  capturedAt,
  markOfMastery: stats.mark_of_mastery,
  marksOnGun: marksOnGun ?? null,
  maxFrags: stats.max_frags ?? null,
  maxXp: stats.max_xp ?? null
});

const blockedTotal = (row: { avgDamageBlocked: number; battles: number }): number => row.avgDamageBlocked * row.battles;

export const buildTankDelta = ({ previous, current, cohort, accountWinRate, tier }: TankDeltaInput): Prisma.TankBattleDeltaCreateManyInput | null => {
  if (!previous || current.battles <= previous.battles) {
    return null;
  }

  return {
    accountId: current.accountId,
    tankId: current.tankId,
    mode: current.mode,
    capturedAt: current.capturedAt,
    cohort,
    accountWinRate,
    tier,
    battles: current.battles - previous.battles,
    wins: current.wins - previous.wins,
    losses: current.losses - previous.losses,
    draws: current.draws - previous.draws,
    damageDealt: current.damageDealt - previous.damageDealt,
    damageReceived: current.damageReceived - previous.damageReceived,
    damageBlocked: Math.max(0, Math.round(blockedTotal(current) - blockedTotal(previous))),
    stunAssistedDamage: (current.stunAssistedDamage ?? 0) - (previous.stunAssistedDamage ?? 0),
    frags: current.frags - previous.frags,
    spotted: current.spotted - previous.spotted,
    xp: current.xp - previous.xp,
    survived: current.survived - previous.survived,
    hits: current.hits - previous.hits,
    shots: current.shots - previous.shots,
    piercings: (current.piercings ?? 0) - (previous.piercings ?? 0),
    capturePoints: current.capturePoints - previous.capturePoints,
    droppedCapturePoints: current.droppedCapturePoints - previous.droppedCapturePoints,
    previousCapturedAt: previous.capturedAt
  };
};

export const isSnapshotMode = (mode: string): mode is SnapshotMode => mode === 'all' || mode === 'random';
