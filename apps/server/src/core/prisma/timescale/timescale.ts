import { createHash } from 'node:crypto';
import { sortBy } from 'remeda';

import type {
  BuildTimescaleStatementsInput,
  RetentionTarget,
  StaleAggregate,
  StaleAggregatesInput,
  TimescaleConfig,
  TimescaleStatement
} from './timescale.types';

import { CONTINUOUS_AGGREGATE, CONTINUOUS_AGGREGATE_SOURCES, HYPERTABLE, TANK_DAILY_STATS_REFRESH, TIMESCALE_SQL } from './timescale.constants';

const interval = (value: string) => `INTERVAL '${value}'`;

const retentionStatements = ({ relation, months }: RetentionTarget): string[] => {
  const remove = `SELECT remove_retention_policy('${relation}', if_exists => TRUE);`;

  if (months === 0) {
    return [remove];
  }

  return [remove, `SELECT add_retention_policy('${relation}', drop_after => ${interval(`${months} months`)});`];
};

export const buildPolicyStatements = (config: TimescaleConfig): string[] => {
  const compressAfter = interval(`${config.compressAfterDays} days`);

  const compression = Object.values(HYPERTABLE).flatMap((relation) => [
    `SELECT remove_compression_policy('${relation}', if_exists => TRUE);`,
    `SELECT add_compression_policy('${relation}', compress_after => ${compressAfter});`
  ]);

  const retention = [
    { relation: HYPERTABLE.accountSnapshot, months: config.snapshotRetentionMonths },
    { relation: HYPERTABLE.tankSnapshot, months: config.snapshotRetentionMonths },
    { relation: HYPERTABLE.tankBattleDelta, months: config.deltaRetentionMonths },
    { relation: CONTINUOUS_AGGREGATE.tankDailyStats, months: config.dailyStatsRetentionMonths }
  ].flatMap(retentionStatements);

  const refresh = [
    `SELECT remove_continuous_aggregate_policy('${CONTINUOUS_AGGREGATE.tankDailyStats}', if_exists => TRUE);`,
    `SELECT add_continuous_aggregate_policy('${CONTINUOUS_AGGREGATE.tankDailyStats}', start_offset => ${interval(TANK_DAILY_STATS_REFRESH.startOffset)}, end_offset => ${interval(TANK_DAILY_STATS_REFRESH.endOffset)}, schedule_interval => ${interval(`${config.refreshIntervalMinutes} minutes`)});`
  ];

  return [...compression, ...retention, ...refresh];
};

export const aggregateDefinitionVersion = (sql: string): string =>
  createHash('sha256').update(sql).digest('hex').slice(0, TIMESCALE_SQL.versionLength);

const staleAggregates = ({ scripts, versions }: StaleAggregatesInput): StaleAggregate[] =>
  CONTINUOUS_AGGREGATE_SOURCES.flatMap(({ relation, file }) => {
    const source = scripts.find(({ label }) => label === file);
    const version = source ? aggregateDefinitionVersion(source.sql) : null;

    return version === null || versions[relation] === version ? [] : [{ relation, version }];
  });

const stampSql = ({ relation, version }: StaleAggregate): string => `DO $$
BEGIN
  EXECUTE format('COMMENT ON %s %I IS %L', CASE (SELECT relkind FROM pg_class WHERE oid = to_regclass('${relation}')) WHEN 'm' THEN 'MATERIALIZED VIEW' ELSE 'VIEW' END, '${relation}', '${version}');
END $$;`;

export const buildTimescaleStatements = ({
  files,
  config,
  versions,
  refresh = false,
  extensionsOnly = false
}: BuildTimescaleStatementsInput): TimescaleStatement[] => {
  const scripts = sortBy(
    files.filter(({ name }) => name.endsWith(TIMESCALE_SQL.extension)),
    ({ name }) => name
  ).map(({ name, sql }) => ({ label: name, sql }));

  const stale = staleAggregates({ scripts, versions });
  const drops = stale.map(({ relation }) => ({ label: TIMESCALE_SQL.dropLabel, sql: `DROP MATERIALIZED VIEW IF EXISTS ${relation} CASCADE;` }));

  if (extensionsOnly) {
    return [...scripts.filter(({ label }) => label === TIMESCALE_SQL.extensionsFile), ...drops];
  }

  const stamps = stale.map((aggregate) => ({ label: TIMESCALE_SQL.versionLabel, sql: stampSql(aggregate) }));
  const policies = buildPolicyStatements(config).map((sql) => ({ label: TIMESCALE_SQL.policiesLabel, sql }));

  const backfill =
    refresh || stale.length > 0
      ? [{ label: TIMESCALE_SQL.refreshLabel, sql: `CALL refresh_continuous_aggregate('${CONTINUOUS_AGGREGATE.tankDailyStats}', NULL, NULL);` }]
      : [];

  return [...drops, ...scripts, ...stamps, ...policies, ...backfill];
};
