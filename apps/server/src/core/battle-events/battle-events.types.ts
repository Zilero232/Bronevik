export type BattleStartedEvent = {
  accountId: bigint;
  tankId: number | null;
  occurredAt: Date;
};

export type BattleEventsSink = {
  started: (event: BattleStartedEvent) => Promise<void>;
};
