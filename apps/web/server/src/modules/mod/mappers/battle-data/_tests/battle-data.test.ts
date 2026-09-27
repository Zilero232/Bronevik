import { getUnixTime } from 'date-fns';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import type { BattleResultEvent } from '../../../lib/contract';

import { BATTLE, moePercent } from '../../../lib/battle';
import { ingestBatchSchema } from '../../../lib/contract';
import { toBattleData } from '../battle-data';

const example = ingestBatchSchema.parse(
  JSON.parse(readFileSync(new URL('../../../../../../../../game/modpack/contract/examples/ingest.example.json', import.meta.url), 'utf8'))
);

const battle = example.events.find((event): event is BattleResultEvent => event.type === 'battle_result');

if (!battle) {
  throw new Error('the ingest example has no battle_result event');
}

describe('toBattleData', () => {
  it('keeps the arena start time and converts the queue time to milliseconds', () => {
    const data = toBattleData({ event: battle, accountId: 1n, deviceId: 'd', sessionId: null, previousMoePercent: null });

    expect(getUnixTime(new Date(data.startedAt))).toBe(battle.arena_created_at);
    expect(data.queueTimeMs).toBe(battle.queue_time_s === null ? null : Math.round(battle.queue_time_s * 1000));
  });

  it('stores the own loadout in the camelCase shape and leaves it out when the mod sent none', () => {
    const withLoadout = toBattleData({ event: battle, accountId: 1n, deviceId: 'd', sessionId: null, previousMoePercent: null });
    const without = toBattleData({ event: { ...battle, loadout: null }, accountId: 1n, deviceId: 'd', sessionId: null, previousMoePercent: null });

    expect(withLoadout.loadout).toMatchObject({ optionalDevices: battle.loadout?.optional_devices, gameplayId: battle.loadout?.gameplay_id });
    expect(without.loadout).toBeUndefined();
  });

  it('computes the MoE delta only when a previous value exists', () => {
    const percent = battle.moe ? moePercent(battle.moe.damage_rating) : null;
    const withPrevious = toBattleData({ event: battle, accountId: 1n, deviceId: 'd', sessionId: null, previousMoePercent: 50 });
    const without = toBattleData({ event: battle, accountId: 1n, deviceId: 'd', sessionId: null, previousMoePercent: null });

    expect(withPrevious.moePercentDelta).toBe(percent === null ? null : percent - 50);
    expect(without.moePercentDelta).toBeNull();
  });

  it('stores platoon mates as bigints, a solo battle as size one and an old mod as unknown', () => {
    const platoon = { size: 2, mates: [42] };
    const inPlatoon = toBattleData({ event: { ...battle, platoon }, accountId: 1n, deviceId: 'd', sessionId: null, previousMoePercent: null });
    const solo = toBattleData({ event: { ...battle, platoon: null }, accountId: 1n, deviceId: 'd', sessionId: null, previousMoePercent: null });

    expect(inPlatoon.platoonSize).toBe(platoon.size);
    expect(inPlatoon.platoonMates).toEqual(platoon.mates.map((mate) => BigInt(mate)));
    const { platoon: _platoon, ...legacy } = battle;
    const unknown = toBattleData({ event: legacy, accountId: 1n, deviceId: 'd', sessionId: null, previousMoePercent: null });

    expect(solo.platoonSize).toBe(BATTLE.soloPlatoonSize);
    expect(solo.platoonMates).toEqual([]);
    expect(unknown.platoonSize).toBeNull();
  });

  it('stores own shots in the camelCase shape and leaves an empty list out', () => {
    const shot = { damage: 400, nominal: 390, shell: 'armor_piercing', outcome: 'damage', distance_m: 180, fatal: false } as const;
    const withShots = toBattleData({ event: { ...battle, shots: [shot] }, accountId: 1n, deviceId: 'd', sessionId: null, previousMoePercent: null });
    const without = toBattleData({ event: { ...battle, shots: [] }, accountId: 1n, deviceId: 'd', sessionId: null, previousMoePercent: null });

    expect(withShots.shots).toEqual([
      { damage: shot.damage, nominal: shot.nominal, shell: shot.shell, outcome: shot.outcome, distance: shot.distance_m, fatal: shot.fatal }
    ]);

    expect(without.shots).toBeUndefined();
  });

  it('stores missing economy costs as null rather than zero', () => {
    const { repair_cost: _repair, ammo_cost: _ammo, consumables_cost: _consumables, free_xp: _freeXp, ...stats } = battle.stats;
    const data = toBattleData({ event: { ...battle, stats }, accountId: 1n, deviceId: 'd', sessionId: null, previousMoePercent: null });

    expect([data.repairCost, data.ammoCost, data.consumablesCost, data.freeXp]).toEqual([null, null, null, null]);
    expect(data.isPremiumAccount).toBe(battle.stats.is_premium);
  });

  it('keeps reported economy costs', () => {
    const data = toBattleData({
      event: { ...battle, stats: { ...battle.stats, repair_cost: 0, ammo_cost: 1800, consumables_cost: 3000, free_xp: 57 } },
      accountId: 1n,
      deviceId: 'd',
      sessionId: null,
      previousMoePercent: null
    });

    expect([data.repairCost, data.ammoCost, data.consumablesCost, data.freeXp]).toEqual([0, 1800, 3000, 57]);
  });
});
