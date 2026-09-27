import { describe, expect, it } from 'vitest';

import { ARENA_BONUS_TYPE, GAME_MODE_BONUS_TYPES } from '../../../../../common/lib';
import { BATTLE_CORROBORATION } from '../../../config';
import { corroboratedBattleSql } from '../battle-corroboration';

describe('corroboratedBattleSql', () => {
  it('trusts a mod battle only when the Lesta API deltas for the same account and tank cover it', () => {
    expect(corroboratedBattleSql.sql).toMatch(
      /FROM tank_battle_delta corroboration\s+WHERE corroboration\.account_id = b\.account_id\s+AND corroboration\.tank_id = b\.tank_id/u
    );

    expect(corroboratedBattleSql.sql).toContain('corroboration.battles >= 1');
    expect(corroboratedBattleSql.sql).toContain('corroboration.damage_dealt >= b.damage_dealt');
  });

  it('looks for the deltas only inside the configured window after the battle', () => {
    expect(corroboratedBattleSql.values).toContain(BATTLE_CORROBORATION.windowHours);
    expect(corroboratedBattleSql.sql).toContain('corroboration.captured_at >= b.started_at');
  });

  it('also accepts a parsed replay of the same battle with the same damage', () => {
    expect(corroboratedBattleSql.sql).toContain('corroborating_replay.arena_unique_id = b.arena_unique_id');
    expect(corroboratedBattleSql.sql).toContain('corroborating_replay.damage_dealt = b.damage_dealt');
  });

  it('requires corroboration only for the random battle types the collector deltas cover', () => {
    expect(BATTLE_CORROBORATION.collectorBattleTypes).toEqual(GAME_MODE_BONUS_TYPES.random.map(String));
    expect(corroboratedBattleSql.sql).toMatch(/^\(\s+b\.battle_type <> ALL\(\?::text\[\]\)\s+OR EXISTS/u);
    expect(corroboratedBattleSql.values).toContainEqual(BATTLE_CORROBORATION.collectorBattleTypes);
  });

  it('lets frontline, ranked, onslaught and steel hunter battles through as the owner signed them', () => {
    const passThrough = [
      ...GAME_MODE_BONUS_TYPES.frontline,
      ...GAME_MODE_BONUS_TYPES.ranked,
      ...GAME_MODE_BONUS_TYPES.onslaught,
      ...GAME_MODE_BONUS_TYPES.steelHunter
    ];

    expect(passThrough.map(String).filter((type) => BATTLE_CORROBORATION.collectorBattleTypes.includes(type))).toEqual([]);
    expect(BATTLE_CORROBORATION.collectorBattleTypes).toContain(String(ARENA_BONUS_TYPE.regular));
  });
});
