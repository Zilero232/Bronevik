import type { ClanPage, TankDetail } from '@/shared/api/generated';
import type { Locale } from '@/shared/i18n';
import type { OgMetric } from '@/shared/seo/og';

export type EntityOgKind = 'build' | 'tank';

type EntityOgInput = {
  locale: Locale;
  host: string;
};

export type TankOgCardInput = EntityOgInput & {
  tank: Pick<TankDetail, 'serverStats' | 'vehicle'>;
  kind: EntityOgKind;
};

export type ClanOgCardInput = EntityOgInput & {
  page: Pick<ClanPage, 'clan' | 'stats'>;
};

export type EntityOgCardData = {
  heading: string;
  title: string;
  subtitle: string;
  metrics: OgMetric[];
  url: string;
  source: string;
};
