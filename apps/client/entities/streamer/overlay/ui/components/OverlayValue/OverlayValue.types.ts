import type { OverlayValueKind } from '../../../lib/overlay-metric';

export type OverlayValueProps = {
  value: number | null;
  kind: OverlayValueKind;
  animate: boolean;
  className?: string;
};
