import type { OverlayConfig } from '@otmetki/schemas';

export type OverlayConfigPatch = Partial<OverlayConfig>;

export type MergePreviewConfigInput = {
  config: OverlayConfig;
  patch: OverlayConfigPatch | null;
};
