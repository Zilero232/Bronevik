export type LevelKeyInput = {
  accountId: bigint;
  tankId: number;
  level: number;
};

export type ChallengeKeyInput = {
  accountId: bigint;
  tankId: number;
  week: string;
  code: string;
};

export type SeasonRewardKeyInput = {
  userId: string;
  season: string;
  level: number;
};

export type PurchaseKeyInput = {
  userId: string;
  code: string;
};
