import type { PlayerProfile, RatingPeriod } from '@bronevik/schemas';
import type { ReactNode } from 'react';

export type ProfileContextValue = {
  profile: PlayerProfile;
  accountId: number;
  nickname: string;
  period: RatingPeriod;
  setPeriod: (period: RatingPeriod) => void;
};

export type ProfileProviderProps = {
  profile: PlayerProfile;
  children: ReactNode;
};
