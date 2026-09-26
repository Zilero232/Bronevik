import type { OverlayConfig } from '@otmetki/schemas';

import type { OverlayData } from '@/shared/api/streamers';

export type OverlayBoardProps = {
  data: OverlayData;
  config: OverlayConfig;
  className?: string;
};
