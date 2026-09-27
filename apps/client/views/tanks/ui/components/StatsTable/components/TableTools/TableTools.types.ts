import type { OptionalTankColumn } from '../../../../../model/hooks';

export type TableToolsProps = {
  visible: OptionalTankColumn[];
  onVisibleChange: (visible: OptionalTankColumn[]) => void;
  onExport: () => void;
};
