export type BonusStatusInput = {
  working: number;
  expired: number;
  expiresAt: Date | null;
  now: Date;
};
