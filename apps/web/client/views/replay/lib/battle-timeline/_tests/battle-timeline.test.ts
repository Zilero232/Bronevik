import { describe, expect, it } from 'vitest';

import type { ReplayPlayer } from '@/entities/replay/replay';

import { aliveSeries, battleLength, formatClock, killEvents } from '../battle-timeline';

const player = (fields: Partial<ReplayPlayer>): ReplayPlayer => ({
  accountId: 1,
  nickname: 'Player',
  clanTag: null,
  team: 1,
  tankId: 1,
  damageDealt: null,
  frags: null,
  survived: true,
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
  lifeTimeSec: 300,
  killerVehicleId: null,
  ...fields
});

const SERIES = { maxPoints: 61, minStepSec: 5 };

describe('aliveSeries', () => {
  it('starts with full teams and drops a vehicle right at its death time', () => {
    const players = [
      player({ vehicleId: 1, team: 1 }),
      player({ vehicleId: 2, team: 1, survived: false, lifeTimeSec: 100 }),
      player({ vehicleId: 3, team: 2 })
    ];

    const series = aliveSeries({ players, recorderTeam: 1, durationSec: 300, ...SERIES });
    const atDeath = series?.times.indexOf(100) ?? -1;

    expect(series?.allies[0]).toBe(2);
    expect(series?.enemies[0]).toBe(1);
    expect(series?.allies[atDeath - 1]).toBe(2);
    expect(series?.allies[atDeath]).toBe(1);
  });

  it('ends exactly at the battle length without repeating a point', () => {
    const series = aliveSeries({ players: [player({})], recorderTeam: 1, durationSec: 302, ...SERIES });

    expect(series?.times.at(-1)).toBe(302);
    expect(new Set(series?.times).size).toBe(series?.times.length);
  });

  it('never samples more points than asked for a long battle', () => {
    const series = aliveSeries({ players: [player({})], recorderTeam: 1, durationSec: 900, ...SERIES });

    expect(series?.times.length).toBeLessThanOrEqual(SERIES.maxPoints + 1);
  });

  it('leaves out players without a post-battle result', () => {
    const series = aliveSeries({ players: [player({}), player({ survived: null })], recorderTeam: 1, durationSec: 60, ...SERIES });

    expect(series?.allies[0]).toBe(1);
  });

  it('has no timeline when nobody has a post-battle result', () => {
    expect(aliveSeries({ players: [player({ survived: null })], recorderTeam: 1, durationSec: 300, ...SERIES })).toBeNull();
  });
});

describe('battleLength', () => {
  it('stretches to the last death when the stored duration is missing', () => {
    expect(battleLength({ players: [player({ survived: false, lifeTimeSec: 250 })], durationSec: null })).toBe(250);
  });

  it('is unknown with no duration and no deaths', () => {
    expect(battleLength({ players: [player({})], durationSec: null })).toBeNull();
  });
});

describe('killEvents', () => {
  it('lists destroyed vehicles in time order and resolves the killer by vehicle id', () => {
    const killer = player({ vehicleId: 10, team: 2 });
    const early = player({ vehicleId: 1, survived: false, lifeTimeSec: 40, killerVehicleId: 10 });
    const late = player({ vehicleId: 11, team: 2, survived: false, lifeTimeSec: 90, killerVehicleId: 1 });

    const events = killEvents({ players: [late, killer, early], recorderTeam: 1 });

    expect(events.map((event) => event.timeSec)).toEqual([40, 90]);
    expect(events[0]?.killer).toBe(killer);
    expect(events[0]?.isAllyLoss).toBe(true);
    expect(events[1]?.isAllyLoss).toBe(false);
  });

  it('keeps a death whose killer is not among the listed players', () => {
    const events = killEvents({ players: [player({ survived: false, lifeTimeSec: 10, killerVehicleId: 99 })], recorderTeam: 1 });

    expect(events).toHaveLength(1);
    expect(events[0]?.killer).toBeNull();
  });
});

describe('formatClock', () => {
  it('pads seconds and never goes negative', () => {
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(-3)).toBe('0:00');
  });
});
