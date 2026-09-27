import { describe, expect, it } from 'vitest';

import { TIMESCALE } from '../../../../config';
import { aggregateDefinitionVersion, buildPolicyStatements, buildTimescaleStatements } from '../timescale';
import { CONTINUOUS_AGGREGATE, CONTINUOUS_AGGREGATE_SOURCES, HYPERTABLE, TIMESCALE_SQL } from '../timescale.constants';

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
    const statements = buildTimescaleStatements({ files, config: CONFIG, versions: {} });

    expect(statements.slice(0, 2)).toEqual([
      { label: '001_a.sql', sql: 'A' },
      { label: '002_b.sql', sql: 'B' }
    ]);

    expect(statements.slice(2).map(({ sql }) => sql)).toEqual(buildPolicyStatements(CONFIG));
    expect(statements.some(({ sql }) => sql === 'ignored')).toBe(false);
  });

  it('appends the backfill only on refresh', () => {
    const plain = buildTimescaleStatements({ files, config: CONFIG, versions: {} });
    const refreshed = buildTimescaleStatements({ files, config: CONFIG, versions: {}, refresh: true });

    expect(plain.some(({ label }) => label === TIMESCALE_SQL.refreshLabel)).toBe(false);

    expect(refreshed.at(-1)).toEqual({
      label: TIMESCALE_SQL.refreshLabel,
      sql: `CALL refresh_continuous_aggregate('${CONTINUOUS_AGGREGATE.tankDailyStats}', NULL, NULL);`
    });
  });

  it('runs only the extensions file before the schema is pushed', () => {
    const statements = buildTimescaleStatements({
      files: [...files, { name: TIMESCALE_SQL.extensionsFile, sql: 'EXT' }],
      config: CONFIG,
      versions: {},
      extensionsOnly: true,
      refresh: true
    });

    expect(statements).toEqual([{ label: TIMESCALE_SQL.extensionsFile, sql: 'EXT' }]);
  });
});

describe('buildTimescaleStatements continuous aggregate versions', () => {
  const [source] = CONTINUOUS_AGGREGATE_SOURCES;
  const aggregateFile = { name: source.file, sql: 'CREATE MATERIALIZED VIEW IF NOT EXISTS v2' };
  const files = [{ name: TIMESCALE_SQL.extensionsFile, sql: 'EXT' }, aggregateFile];
  const current = { [source.relation]: aggregateDefinitionVersion(aggregateFile.sql) };
  const drop = `DROP MATERIALIZED VIEW IF EXISTS ${source.relation} CASCADE;`;

  it('leaves an aggregate whose stored version matches its definition alone', () => {
    const statements = buildTimescaleStatements({ files, config: CONFIG, versions: current });

    expect(statements.some(({ sql }) => sql === drop)).toBe(false);
    expect(statements.some(({ label }) => label === TIMESCALE_SQL.refreshLabel)).toBe(false);
  });

  it('drops a changed aggregate before the schema push so its columns can go', () => {
    const statements = buildTimescaleStatements({ files, config: CONFIG, versions: { [source.relation]: 'old' }, extensionsOnly: true });

    expect(statements.map(({ sql }) => sql)).toEqual(['EXT', drop]);
  });

  it('recreates, stamps and backfills an aggregate that is missing or unversioned', () => {
    const statements = buildTimescaleStatements({ files, config: CONFIG, versions: { [source.relation]: null } });
    const labels = statements.map(({ label }) => label);

    expect(statements[0]?.sql).toBe(drop);
    expect(labels.indexOf(TIMESCALE_SQL.versionLabel)).toBeGreaterThan(labels.indexOf(source.file));
    expect(statements.find(({ label }) => label === TIMESCALE_SQL.versionLabel)?.sql).toContain(current[source.relation]);
    expect(labels.at(-1)).toBe(TIMESCALE_SQL.refreshLabel);
  });

  it('changes the version whenever the definition changes', () => {
    expect(aggregateDefinitionVersion('a')).not.toBe(aggregateDefinitionVersion('b'));
  });
});
