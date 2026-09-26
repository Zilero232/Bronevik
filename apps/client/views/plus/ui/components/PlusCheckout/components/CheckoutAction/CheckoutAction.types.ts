import type { CheckoutNote } from '../../../../../lib/checkout-note';

export type CheckoutActionProps = {
  isSignedIn: boolean;
  isPlus: boolean;
  isPending: boolean;
  isSubmitting: boolean;
  isCheckoutAvailable: boolean;
  trialAvailable: boolean;
  trialDays: number;
  isStartingTrial: boolean;
  note: CheckoutNote;
  onStartTrial: () => void;
};
