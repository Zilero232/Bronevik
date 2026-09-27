import type { OverlayConfig, PlayerProfile, Session } from '@otmetki/schemas';

export type PreviewOverlayInput = {
  profile: PlayerProfile;
  session: Session | null;
  config: OverlayConfig;
};
