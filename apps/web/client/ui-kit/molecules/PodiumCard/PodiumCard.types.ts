import type { ReactNode } from 'react';

import type { RatingTone } from '@/shared/lib';

export type PodiumCardProps = {
  rank: number;
  rankLabel: string;
  name: ReactNode;
  metricLabel: ReactNode;
  value: ReactNode;
  tone?: RatingTone | null;
  meta?: ReactNode;
  href?: string;
  glyph?: ReactNode;
  className?: string;
};
