import type { PlusStateKind } from '@otmetki/schemas';

export type CheckoutActionProps = {
  isSignedIn: boolean;
  isPlus: boolean;
  isPending: boolean;
  isSubmitting: boolean;
  isCheckoutAvailable: boolean;
  trialAvailable: boolean;
  trialDays: number;
  isStartingTrial: boolean;
  state: PlusStateKind;
  periodEnd: string | null;
  onStartTrial: () => void;
};
