import type { Session } from '@bronevik/schemas';

import type { Locale } from '@/shared/i18n';

import type { OgLabels } from '../../lib';

export type SessionOgCardProps = {
  nickname: string;
  session: Session;
  labels: OgLabels;
  locale: Locale;
};
