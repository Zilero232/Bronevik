import { describe, expect, it } from 'vitest';

import { corroboratedBattleSql } from '../../../../mod';
import { wrappedBestBattleSql } from '../wrapped-best-battle';

describe('wrappedBestBattleSql', () => {
  it('picks the best battle only among corroborated mod battles', () => {
    const query = wrappedBestBattleSql({ accountId: 1n, start: new Date('2026-01-01T00:00:00.000Z'), end: new Date('2027-01-01T00:00:00.000Z') });

    expect(query.sql).toContain(corroboratedBattleSql.sql);
  });
});
