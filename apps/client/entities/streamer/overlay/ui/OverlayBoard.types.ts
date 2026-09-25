import type { OverlayConfig } from '@bronevik/schemas';

import type { OverlayData } from '@/shared/api/streamers';

export type OverlayBoardProps = {
  data: OverlayData;
  config: OverlayConfig;
  className?: string;
};
