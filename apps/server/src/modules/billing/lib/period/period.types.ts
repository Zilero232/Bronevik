import type { Subscription } from '../../../../../generated';

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

export type IsEntitledInput = {
  subscription: Pick<Subscription, 'currentPeriodEnd' | 'status'> | null;
  now: Date;
};
