import type { StreamerSettings } from '@otmetki/schemas';

export type ApplySettingsProps = {
  slug: string;
  settings: StreamerSettings;
  className?: string;
};
