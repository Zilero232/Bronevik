import type { RatingTone } from '@/shared/lib';

export type ServerFigure = {
  key: string;
  label: string;
  value: number;
  format: Intl.NumberFormatOptions;
  suffix: string | undefined;
  tone: RatingTone | undefined;
};
