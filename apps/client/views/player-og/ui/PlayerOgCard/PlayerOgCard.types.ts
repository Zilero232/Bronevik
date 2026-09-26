import type { PlayerProfile } from '@otmetki/schemas';

import type { Locale } from '@/shared/i18n';

import type { OgLabels } from '../../lib';

export type PlayerOgCardProps = {
  profile: PlayerProfile;
  labels: OgLabels;
  locale: Locale;
  host: string;
};
