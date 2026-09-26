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

export type BuildTimescaleStatementsInput = {
  files: readonly TimescaleSqlFile[];
  config: TimescaleConfig;
  refresh?: boolean;
  extensionsOnly?: boolean;
};
