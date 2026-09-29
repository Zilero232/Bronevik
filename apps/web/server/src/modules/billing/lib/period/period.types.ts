export type ExtendPeriodInput = {
  currentPeriodEnd: Date | null;
  now: Date;
  months?: number;
  days?: number;
};

export type AutoRenewInput = {
  isRecurringEnabled: boolean;
  hasMethod: boolean;
  wasCancelled: boolean;
};

export type RenewalKeyInput = {
  subscriptionId: string;
  currentPeriodEnd: Date;
};

export type RevokePeriodInput = {
  currentPeriodEnd: Date;
  now: Date;
  months: number;
};

export type RevokedPeriod = {
  currentPeriodEnd: Date;
  isExpired: boolean;
};
