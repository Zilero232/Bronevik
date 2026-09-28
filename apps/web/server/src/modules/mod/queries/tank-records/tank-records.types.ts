export type TankRecordsSqlInput = {
  accountId: bigint;
  tankIds: number[];
  battleTypes: string[];
};

export type TankRecordRow = {
  tankId: number;
  maxDamage: number | null;
  maxAssist: number | null;
  maxFrags: number | null;
  maxXp: number | null;
};
