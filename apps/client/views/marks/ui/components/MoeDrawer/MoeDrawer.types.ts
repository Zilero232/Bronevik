import type { MoeRow } from '@bronevik/schemas';

export type MoeDrawerProps = {
  row: MoeRow | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};
