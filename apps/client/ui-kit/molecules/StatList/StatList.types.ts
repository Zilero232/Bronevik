import type { ReactNode } from 'react';

import type { RatingTone, StatValueKind } from '@/shared/lib';

export type StatListItem = {
  id: string;
  label: ReactNode;
  value: number | string | null | undefined;
  kind?: StatValueKind;
  suffix?: ReactNode;
  isHighlighted?: boolean;
  tone?: RatingTone;
};

export type StatListProps = {
  title?: ReactNode;
  items: readonly StatListItem[];
  columns?: 1 | 2;
  className?: string;
};
