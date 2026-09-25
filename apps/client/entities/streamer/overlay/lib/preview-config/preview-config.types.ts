import type { OverlayConfig } from '@bronevik/schemas';

export type OverlayConfigPatch = Partial<OverlayConfig>;

export type MergePreviewConfigInput = {
  config: OverlayConfig;
  patch: OverlayConfigPatch | null;
};
