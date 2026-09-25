import type { OverlayConfigPatch } from '@/entities/streamer/overlay';
import type { OverlayData } from '@/shared/api/streamers';

export type OverlayStageProps = {
  data: OverlayData;
  patch: OverlayConfigPatch | null;
};
