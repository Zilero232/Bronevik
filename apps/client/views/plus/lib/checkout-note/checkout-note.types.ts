import type { PlusStateKind } from '@otmetki/schemas';

export type CheckoutNoteInput = {
  isPlus: boolean;
  state: PlusStateKind;
  periodEnd: string | null;
  isCheckoutAvailable: boolean;
};

export type CheckoutNote =
  { kind: 'state'; state: 'active' | 'grace' | 'trial'; periodEnd: string | null } | { kind: 'text'; key: 'closedNote' | 'note' | 'notePlus' };
