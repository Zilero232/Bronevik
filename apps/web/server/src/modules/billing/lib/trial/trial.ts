import { PLUS_TRIAL } from '@otmetki/schemas';

import type { TrialEligibilityInput } from './trial.types';

export const isTrialEligible = ({ linkedAccounts, trialedRecords, hasStartedTrial }: TrialEligibilityInput): boolean =>
  linkedAccounts > 0 && trialedRecords === 0 && !hasStartedTrial;

export const trialDaysFor = (isReferred: boolean): number => (isReferred ? PLUS_TRIAL.referralDays : PLUS_TRIAL.days);
