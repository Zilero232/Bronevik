import { describe, expect, it } from 'vitest';

import { corroboratedBattleSql } from '../../../../mod';
import { challengeBattlesSql } from '../challenge-battles';

describe('challengeBattlesSql', () => {
  it('counts only corroborated mod battles toward a challenge', () => {
    const query = challengeBattlesSql({ accountIds: [1n], start: new Date('2026-09-21T00:00:00.000Z'), end: new Date('2026-09-28T00:00:00.000Z') });

    expect(query.sql).toContain(corroboratedBattleSql.sql);
  });
});
