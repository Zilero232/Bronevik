export type MarkBattle = {
  id: string;
  accountId: bigint;
  tankId: number;
  marksOnGun: number;
  startedAt: Date;
};

export type MarkPair = Pick<MarkBattle, 'accountId' | 'tankId'>;

export type DetectMarkGainsInput = {
  battles: readonly MarkBattle[];
  previous: ReadonlyMap<string, number>;
};
