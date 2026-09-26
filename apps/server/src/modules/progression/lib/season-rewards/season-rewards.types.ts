export type SeasonRewardsInput = {
  season: string;
  level: number;
};

export type TrackReward = { kind: 'cosmetic'; level: number; code: string } | { kind: 'shells'; level: number; amount: number };
