import { describe, expect, it } from 'vitest';

import { TIMESCALE } from '../../../../config';
import { buildPolicyStatements, buildTimescaleStatements } from '../timescale';
import { CONTINUOUS_AGGREGATE, HYPERTABLE, TIMESCALE_SQL } from '../timescale.constants';

const CONFIG = TIMESCALE;

describe('buildPolicyStatements', () => {
  it('re-adds compression for every hypertable with the configured window', () => {
    const statements = buildPolicyStatements(CONFIG);

    for (const relation of Object.values(HYPERTABLE)) {
      expect(statements).toContain(`SELECT remove_compression_policy('${relation}', if_exists => TRUE);`);
      expect(statements).toContain(`SELECT add_compression_policy('${relation}', compress_after => INTERVAL '${CONFIG.compressAfterDays} days');`);
    }
  });

  it('only removes the retention policy when months is zero', () => {
    const statements = buildPolicyStatements({ ...CONFIG, deltaRetentionMonths: 0, snapshotRetentionMonths: 6 });

    expect(statements.some((sql) => sql.startsWith(`SELECT add_retention_policy('${HYPERTABLE.tankBattleDelta}'`))).toBe(false);
    expect(statements).toContain(`SELECT add_retention_policy('${HYPERTABLE.tankSnapshot}', drop_after => INTERVAL '6 months');`);
  });

  it('schedules the continuous aggregate refresh from the config', () => {
    const statements = buildPolicyStatements({ ...CONFIG, refreshIntervalMinutes: 7 });
    const refresh = statements.find((sql) => sql.startsWith('SELECT add_continuous_aggregate_policy'));

    expect(refresh).toContain(CONTINUOUS_AGGREGATE.tankDailyStats);
    expect(refresh).toContain("schedule_interval => INTERVAL '7 minutes'");
  });
});

describe('buildTimescaleStatements', () => {
  const files = [
    { name: '002_b.sql', sql: 'B' },
    { name: 'README.md', sql: 'ignored' },
    { name: '001_a.sql', sql: 'A' }
  ];

  it('runs the SQL files in name order, then the policies', () => {
    const statements = buildTimescaleStatements({ files, config: CONFIG });

    expect(statements.slice(0, 2)).toEqual([
      { label: '001_a.sql', sql: 'A' },
      { label: '002_b.sql', sql: 'B' }
    ]);

    expect(statements.slice(2).map(({ sql }) => sql)).toEqual(buildPolicyStatements(CONFIG));
    expect(statements.some(({ sql }) => sql === 'ignored')).toBe(false);
  });

  it('appends the backfill only on refresh', () => {
    const plain = buildTimescaleStatements({ files, config: CONFIG });
    const refreshed = buildTimescaleStatements({ files, config: CONFIG, refresh: true });

    expect(plain.some(({ label }) => label === TIMESCALE_SQL.refreshLabel)).toBe(false);

    expect(refreshed.at(-1)).toEqual({
      label: TIMESCALE_SQL.refreshLabel,
      sql: `CALL refresh_continuous_aggregate('${CONTINUOUS_AGGREGATE.tankDailyStats}', NULL, NULL);`
    });
  });
});
