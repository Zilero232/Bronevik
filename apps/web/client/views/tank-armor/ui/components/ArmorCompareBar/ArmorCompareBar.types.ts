import type { TankPickerProps } from '@/features/tank/pick-tank';

export type ArmorCompareBarProps = Pick<TankPickerProps, 'excludeIds'> & {
  vehicle: TankPickerProps['value'];
  onPick: TankPickerProps['onChange'];
  onClear: () => void;
};
