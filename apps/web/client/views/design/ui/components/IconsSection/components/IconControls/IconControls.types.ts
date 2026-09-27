import type { IconSize, IconStroke } from '../../../../../model/hooks';

export type IconControlsProps = {
  size: IconSize;
  stroke: IconStroke;
  onSizeChange: (size: IconSize) => void;
  onStrokeChange: (stroke: IconStroke) => void;
};
