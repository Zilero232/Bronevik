export type ExtendPeriodInput = {
  currentPeriodEnd: Date | null;
  now: Date;
  months?: number;
  days?: number;
};

export type IsPeriodActiveInput = {
  currentPeriodEnd: Date | null;
  now: Date;
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
