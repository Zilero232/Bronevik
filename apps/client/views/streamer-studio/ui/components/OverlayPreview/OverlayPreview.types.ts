import type { OverlayConfig } from '@bronevik/schemas';

export type OverlayPreviewProps = {
  config: OverlayConfig;
  publicId: string | null;
  isDraft: boolean;
};
