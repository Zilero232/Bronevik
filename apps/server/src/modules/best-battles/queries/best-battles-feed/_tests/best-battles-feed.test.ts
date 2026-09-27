import { describe, expect, it } from 'vitest';

import { corroboratedBattleSql } from '../../../../mod';
import { facetTotalsSql } from '../../best-battles-facets';
import { modFeedSql, replayFeedSql } from '../best-battles-feed';

const SCOPE = { since: new Date('2026-09-20T00:00:00.000Z'), battleTypes: ['1'], tankIds: null };

describe('best battles and unverified mod data', () => {
  it('lists only mod battles that the Lesta API or a replay corroborates', () => {
    expect(modFeedSql({ ...SCOPE, metric: 'damage', take: 10 }).sql).toContain(corroboratedBattleSql.sql);
  });

  it('counts only corroborated mod battles in the facets', () => {
    expect(facetTotalsSql(SCOPE).sql).toContain(corroboratedBattleSql.sql);
  });

  it('keeps a replay in the feed when the mod battle it duplicates is not corroborated', () => {
    const { sql } = replayFeedSql({ ...SCOPE, metric: 'damage', take: 10 });

    expect(sql).toMatch(/NOT EXISTS \(SELECT 1 FROM battle b WHERE b\.account_id = r\.account_id AND b\.arena_unique_id = r\.arena_unique_id AND/u);
    expect(sql).toContain(corroboratedBattleSql.sql);
  });
});
