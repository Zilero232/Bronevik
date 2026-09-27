import type { BonusCode } from '@otmetki/schemas';

export type CodeRibbon = { kind: 'expiring'; days: number } | { kind: 'new' };

export type CodeRibbonInput = {
  code: BonusCode;
  now: Date | null;
  expiringDays: number;
  freshDays: number;
};

export type ExpiringCountInput = {
  codes: readonly BonusCode[];
  now: Date | null;
  expiringDays: number;
};
