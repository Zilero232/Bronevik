import type { PlayerWrapped } from '@/entities/player/profile';
import type { Locale } from '@/shared/i18n';

import type { OgLabels } from '../../lib';

export type WrappedOgCardProps = {
  nickname: string;
  wrapped: PlayerWrapped;
  labels: OgLabels;
  locale: Locale;
  host: string;
};
