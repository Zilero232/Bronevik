import type { OverlayData } from '@otmetki/schemas';

export type MoePlateProps = {
  moe: NonNullable<OverlayData['moe']>;
  scale: number;
  animate: boolean;
  showTank: boolean;
};
