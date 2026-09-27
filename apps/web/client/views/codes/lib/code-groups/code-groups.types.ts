import type { BonusCode } from '@otmetki/schemas';

export type CodeGroups = {
  active: BonusCode[];
  expired: BonusCode[];
};
