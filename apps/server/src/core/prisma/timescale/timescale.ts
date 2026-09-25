import { sortBy } from 'remeda';

import type { BuildTimescaleStatementsInput, RetentionTarget, TimescaleConfig, TimescaleStatement } from './timescale.types';

import { CONTINUOUS_AGGREGATE, HYPERTABLE, TANK_DAILY_STATS_REFRESH, TIMESCALE_SQL } from './timescale.constants';

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

export const buildTimescaleStatements = ({ files, config, refresh = false }: BuildTimescaleStatementsInput): TimescaleStatement[] => {
  const scripts = sortBy(
    files.filter(({ name }) => name.endsWith(TIMESCALE_SQL.extension)),
    ({ name }) => name
  ).map(({ name, sql }) => ({ label: name, sql }));

  const policies = buildPolicyStatements(config).map((sql) => ({ label: TIMESCALE_SQL.policiesLabel, sql }));

  const backfill = refresh
    ? [{ label: TIMESCALE_SQL.refreshLabel, sql: `CALL refresh_continuous_aggregate('${CONTINUOUS_AGGREGATE.tankDailyStats}', NULL, NULL);` }]
    : [];

  return [...scripts, ...policies, ...backfill];
};
