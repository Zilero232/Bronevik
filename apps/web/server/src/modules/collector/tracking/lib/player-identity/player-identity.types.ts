import type { TrackingTier } from '../../../../../../generated';

export type PlayerIdentity = {
  accountId: bigint;
  nickname: string;
  clanId: bigint | null;
  createdAt: Date;
  trackingTier: TrackingTier;
  logoutAt: Date | null;
};
