import type { RatingTone } from '@/shared/lib';

import type { HERO_FIGURES } from '../../../config';

export type HeroFigure = {
  key: (typeof HERO_FIGURES)[number];
  label: string;
  value: number;
  format: Intl.NumberFormatOptions;
  suffix: string | undefined;
  tone: RatingTone | undefined;
};
