import type { ReactNode } from 'react';

import type { BuildItem } from '../../../../../lib/build-catalog';

export type ItemPickerDialogProps = {
  open: boolean;
  title: ReactNode;
  items: readonly BuildItem[];
  selectedId: number | null;
  takenIds: number[];
  onPick: (id: number | null) => void;
  onOpenChange: (open: boolean) => void;
};
