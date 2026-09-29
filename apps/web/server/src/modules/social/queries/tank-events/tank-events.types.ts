export type SnapshotEventsSqlInput = {
  accountIds: readonly bigint[];
  lookback: Date;
  since: Date;
  until: Date;
  aceMastery: number;
};

export type SnapshotEventRow = {
  account_id: bigint;
  tank_id: number;
  captured_at: Date;
  marks_on_gun: number | null;
  prev_marks: number | null;
  mark_of_mastery: number;
  prev_mastery: number | null;
};
