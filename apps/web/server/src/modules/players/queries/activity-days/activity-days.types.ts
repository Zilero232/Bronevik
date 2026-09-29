export type ActivityDaysSqlInput = {
  accountId: bigint;
  from: Date;
};

export type ActivityRow = {
  day: string;
  battles: number;
  wins: number;
};
