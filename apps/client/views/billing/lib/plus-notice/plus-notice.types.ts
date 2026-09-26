import type { PlusState } from '@otmetki/schemas';

export type PlusNoticeInput = {
  plus: PlusState;
  now: Date;
};

export type PlusNotice = { kind: 'grace'; until: string } | { kind: 'trial'; daysLeft: number };
