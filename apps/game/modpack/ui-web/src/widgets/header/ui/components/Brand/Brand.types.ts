import type { FramePress } from '../../Header.types';

export type BrandProps = {
  compact: boolean;
  onMoveStart: (event: FramePress) => void;
  onRecentre: () => void;
};
