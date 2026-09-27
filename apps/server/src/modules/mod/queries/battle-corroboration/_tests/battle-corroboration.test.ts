import { describe, expect, it } from 'vitest';

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
});
