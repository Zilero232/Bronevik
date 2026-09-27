import { describe, expect, it } from 'vitest';

import { corroboratedBattleSql } from '../../../../mod';
import { rngBattlesSql } from '../rng-battles';

describe('rngBattlesSql', () => {
  it('reads shots only from corroborated mod battles', () => {
    expect(rngBattlesSql({ watermark: null, until: new Date('2026-09-27T00:00:00.000Z'), limit: 500 }).sql).toContain(corroboratedBattleSql.sql);
  });
});
