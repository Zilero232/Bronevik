export type RenewalDueInput = {
  expiresAt: Date | null;
  now: Date;
};

export type RelinkKeyInput = {
  accountId: bigint;
  expiresAt: Date | null;
};
