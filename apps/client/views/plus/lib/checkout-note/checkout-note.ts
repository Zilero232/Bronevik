import type { CheckoutNote, CheckoutNoteInput } from './checkout-note.types';

export const checkoutNote = ({ isPlus, state, periodEnd, isCheckoutAvailable }: CheckoutNoteInput): CheckoutNote => {
  if (isPlus) {
    return state === 'trial' || state === 'grace' || state === 'active' ? { kind: 'state', state, periodEnd } : { kind: 'text', key: 'notePlus' };
  }

  return { kind: 'text', key: isCheckoutAvailable ? 'note' : 'closedNote' };
};
