import type { PlayerProfile, RatingPeriod } from '@otmetki/schemas';

export type ProfileContextValue = {
  profile: PlayerProfile;
  accountId: number;
  nickname: string;
  period: RatingPeriod;
  setPeriod: (period: RatingPeriod) => void;
};
