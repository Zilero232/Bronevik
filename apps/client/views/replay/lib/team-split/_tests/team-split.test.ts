import { describe, expect, it } from 'vitest';

import type { ReplayPlayer } from '@/entities/replay/replay';

import { hitRate, recorderTeamOf, splitTeams, teamTotals } from '../team-split';

const player = (fields: Partial<ReplayPlayer>): ReplayPlayer => ({
  accountId: 1,
  nickname: 'Player',
  clanTag: null,
  team: 1,
  tankId: 1,
  damageDealt: null,
  frags: null,
  survived: null,
  vehicleId: null,
  vehicleType: null,
  maxHealth: null,
  isRecorder: false,
  damageAssisted: null,
  assistRadio: null,
  assistTrack: null,
  assistStun: null,
  damageBlocked: null,
  damageReceived: null,
  spotted: null,
  xp: null,
  shots: null,
  hits: null,
  penetrations: null,
  lifeTimeSec: null,
  killerVehicleId: null,
  ...fields
});

describe('splitTeams', () => {
  it('puts the recorder team first even when the recorder played on team 2', () => {
    const recorder = player({ accountId: 2, team: 2, isRecorder: true });
    const split = splitTeams({ owner: recorder, players: [player({ team: 1 }), recorder] });

    expect(split.recorderTeam).toBe(2);
    expect(split.allies).toEqual([recorder]);
    expect(split.enemies).toHaveLength(1);
  });

  it('orders each team by experience, then by damage', () => {
    const low = player({ accountId: 3, xp: 500, damageDealt: 3000 });
    const high = player({ accountId: 4, xp: 900, damageDealt: 100 });
    const tied = player({ accountId: 5, xp: 500, damageDealt: 4000 });

    expect(splitTeams({ owner: null, players: [low, high, tied] }).allies.map((entry) => entry.accountId)).toEqual([4, 5, 3]);
  });

  it('keeps players without a post-battle result at the bottom', () => {
    const unknown = player({ accountId: 6 });
    const known = player({ accountId: 7, xp: 0 });

    expect(splitTeams({ owner: null, players: [unknown, known] }).allies[0]?.accountId).toBe(7);
  });
});

describe('recorderTeamOf', () => {
  it('falls back to the participant flagged as recorder when the owner is unknown', () => {
    expect(recorderTeamOf({ owner: null, players: [player({ team: 2, isRecorder: true })] })).toBe(2);
  });

  it('defaults to team 1 when nobody is flagged', () => {
    expect(recorderTeamOf({ owner: null, players: [] })).toBe(1);
  });
});

describe('teamTotals', () => {
  it('counts only confirmed survivors as alive and treats missing figures as zero', () => {
    const totals = teamTotals([player({ survived: true, damageDealt: 1000, frags: 2 }), player({ survived: null }), player({ survived: false })]);

    expect(totals).toEqual({ players: 3, alive: 1, damageDealt: 1000, frags: 2, xp: 0 });
  });
});

describe('hitRate', () => {
  it('is unknown without shots rather than zero', () => {
    expect(hitRate({ shots: 0, hits: 0 })).toBeNull();
    expect(hitRate({ shots: null, hits: 3 })).toBeNull();
  });

  it('divides hits by shots', () => {
    expect(hitRate({ shots: 8, hits: 6 })).toBe(0.75);
  });
});
