export type HistoryWindowPolicy = {
  limitDays: number;
  defaultDays: number;
};

export type HistoryWindowInput = {
  from: string | undefined;
  to: string | undefined;
  now: Date;
  policy: HistoryWindowPolicy;
};

export type HistoryWindow = {
  from: Date;
  to: Date;
};
