import type { OverlayData } from '@/shared/api/streamers';

export type MoePlateProps = {
  moe: NonNullable<OverlayData['moe']>;
  scale: number;
  animate: boolean;
  showTank: boolean;
};
