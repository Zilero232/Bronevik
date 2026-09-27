export type RetentionRule = {
  table: string;
  column: string;
  days: number;
  where?: string;
};

export type RetentionResult = Record<string, number>;

export type PurgeTableInput = {
  rule: RetentionRule;
  cutoff: Date;
};
