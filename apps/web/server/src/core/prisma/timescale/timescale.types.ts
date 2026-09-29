export type TimescaleConfig = {
  compressAfterDays: number;
  snapshotRetentionMonths: number;
  deltaRetentionMonths: number;
  dailyStatsRetentionMonths: number;
  refreshIntervalMinutes: number;
};

export type RetentionTarget = {
  relation: string;
  months: number;
};

type TimescaleSqlFile = {
  name: string;
  sql: string;
};

export type TimescaleStatement = {
  label: string;
  sql: string;
};

type AggregateVersions = Readonly<Record<string, string | null>>;

export type StaleAggregate = {
  relation: string;
  version: string;
};

export type StaleAggregatesInput = {
  scripts: readonly TimescaleStatement[];
  versions: AggregateVersions;
};

export type BuildTimescaleStatementsInput = {
  files: readonly TimescaleSqlFile[];
  config: TimescaleConfig;
  versions: AggregateVersions;
  refresh?: boolean;
  extensionsOnly?: boolean;
};
