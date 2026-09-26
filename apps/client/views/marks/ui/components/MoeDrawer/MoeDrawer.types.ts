import type { MoeRow } from '@otmetki/schemas';

export type MoeDrawerProps = {
  row: MoeRow | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};
