export type ExpectedValues = {
  tankId: number;
  expDamage: number;
  expSpot: number;
  expFrag: number;
  expDef: number;
  expWinRate: number;
};

export type ExpectedValuesTable = ReadonlyMap<number, ExpectedValues>;

export type XvmExpectedValuesFile = {
  header: Record<string, unknown>;
  table: ExpectedValuesTable;
};
