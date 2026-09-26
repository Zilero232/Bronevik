import type { OverlayConfigPatch } from '@/entities/streamer/overlay';
import type { OverlayData } from '@/entities/streamer/streamer';

export type OverlayStageProps = {
  data: OverlayData;
  patch: OverlayConfigPatch | null;
};
