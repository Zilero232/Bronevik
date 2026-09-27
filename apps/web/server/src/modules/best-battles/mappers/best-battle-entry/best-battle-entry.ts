import type { BestBattle } from '../../best-battles.types';
import type { BestBattleMedal, ToArenaInput, ToBestBattleInput, ToMedalInput } from './best-battle-entry.types';

const count = (value: number | null): number | null => (value === null ? null : Math.max(0, Math.round(value)));

export const toMedal = ({ name, medals }: ToMedalInput): BestBattleMedal => medals.get(name) ?? { name, title: name, image: null };

export const toArena = ({ arenaId, fallback, arenas }: ToArenaInput): BestBattle['arena'] =>
  arenaId === null ? null : { arenaId, name: arenas.get(arenaId) ?? fallback ?? arenaId };

export const toBestBattle = ({ row, vehicles, arenas, medals }: ToBestBattleInput): BestBattle | null => {
  const vehicle = vehicles.get(row.tank_id);

  if (!vehicle) {
    return null;
  }

  const accountId = Number(row.account_id);

  return {
    key: row.key,
    rank: row.rank,
    source: row.source,
    accountId,
    nickname: row.nickname ?? String(accountId),
    vehicle,
    arena: toArena({ arenaId: row.arena_id, fallback: row.map_name, arenas }),
    result: row.result,
    damage: count(row.damage),
    assisted: count(row.assisted),
    spotted: count(row.spotted),
    frags: count(row.frags),
    xp: count(row.xp),
    blocked: count(row.blocked),
    medals: row.medals.map((name) => toMedal({ name, medals })),
    playedAt: row.played_at.toISOString(),
    replayId: row.replay_id
  };
};
