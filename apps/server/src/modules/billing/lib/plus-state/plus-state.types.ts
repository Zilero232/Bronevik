import type { Subscription } from '../../../../../generated';

export type PlusStateInput = {
  subscription: Pick<Subscription, 'currentPeriodEnd' | 'status'> | null;
  now: Date;
  trialAvailable: boolean;
  trialDays: number;
};
