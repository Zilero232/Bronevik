import type { BonusCode } from '@otmetki/schemas';

export type CodeListProps = {
  codes: BonusCode[];
  isPending: boolean;
  emptyTitle: string;
};
