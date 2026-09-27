import { sortBy } from 'remeda';

import type { ReplayPlayer } from '@/entities/replay/replay';

import type { AliveAtInput, AliveSeries, AliveSeriesInput, KillEvent, KillEventsInput } from './battle-timeline.types';

const isDestroyed = (player: ReplayPlayer): player is ReplayPlayer & { lifeTimeSec: number } =>
  player.survived === false && player.lifeTimeSec !== null;

const aliveAt = ({ players, timeSec }: AliveAtInput): number =>
  players.filter((player) => !isDestroyed(player) || player.lifeTimeSec > timeSec).length;

export const battleLength = ({ players, durationSec }: Pick<AliveSeriesInput, 'durationSec' | 'players'>): number | null => {
  const lastDeath = Math.max(0, ...players.filter(isDestroyed).map((player) => player.lifeTimeSec));
  const length = Math.max(durationSec ?? 0, lastDeath);

  return length > 0 ? length : null;
};

export const aliveSeries = ({ players, recorderTeam, durationSec, maxPoints, minStepSec }: AliveSeriesInput): AliveSeries | null => {
  const known = players.filter((player) => player.survived !== null);
  const length = battleLength({ players: known, durationSec });

  if (known.length === 0 || length === null) {
    return null;
  }

  const step = Math.max(minStepSec, Math.ceil(length / Math.max(1, maxPoints - 1)));
  const times = Array.from({ length: Math.ceil(length / step) }, (_, index) => index * step).concat(length);
  const allies = known.filter((player) => player.team === recorderTeam);
  const enemies = known.filter((player) => player.team !== recorderTeam);

  return {
    times,
    allies: times.map((timeSec) => aliveAt({ players: allies, timeSec })),
    enemies: times.map((timeSec) => aliveAt({ players: enemies, timeSec }))
  };
};

export const killEvents = ({ players, recorderTeam }: KillEventsInput): KillEvent[] => {
  const byVehicle = new Map(players.flatMap((player) => (player.vehicleId === null ? [] : [[player.vehicleId, player] as const])));

  return sortBy(
    players.filter(isDestroyed).map((victim) => ({
      timeSec: victim.lifeTimeSec,
      victim,
      killer: victim.killerVehicleId === null ? null : (byVehicle.get(victim.killerVehicleId) ?? null),
      isAllyLoss: victim.team === recorderTeam
    })),
    (event) => event.timeSec
  );
};

export const formatClock = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};
