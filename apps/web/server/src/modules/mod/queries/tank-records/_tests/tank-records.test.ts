import { describe, expect, it } from 'vitest';

import { bonusTypesOfMode } from '../../../../../common/lib';
import { tankRecordsSql } from '../tank-records';

const INPUT = { accountId: 12_345n, tankIds: [1, 2849], battleTypes: bonusTypesOfMode('random') };

describe('tankRecordsSql', () => {
  it('reads only the battles of the given account', () => {
    const query = tankRecordsSql(INPUT);

    expect(query.sql).toContain('b.account_id = ?');
    expect(query.values[0]).toBe(INPUT.accountId);
  });

  it('limits the maxima to the requested tanks and battle types', () => {
    const query = tankRecordsSql(INPUT);

    expect(query.sql).toContain('b.tank_id = ANY(?::int[])');
    expect(query.sql).toContain('b.battle_type = ANY(?::text[])');
    expect(query.values).toContainEqual(INPUT.tankIds);
    expect(query.values).toContainEqual(INPUT.battleTypes);
  });

  it('counts assistance as radio plus tracking, without stun', () => {
    expect(tankRecordsSql(INPUT).sql).toContain('MAX(b.damage_assisted_radio + b.damage_assisted_track)');
    expect(tankRecordsSql(INPUT).sql).not.toContain('damage_assisted_stun');
  });
});
