import type { CompareKind, CompareSelection } from '@/features/compare/compare-selection';
import type { TankImageSubject } from '@/ui-kit';

export type TrayChipData = {
  id: number;
  name: string;
  href: string;
  tank: TankImageSubject | null;
};

export type TrayChipsInput = {
  selection: CompareSelection;
  kind: CompareKind;
};
