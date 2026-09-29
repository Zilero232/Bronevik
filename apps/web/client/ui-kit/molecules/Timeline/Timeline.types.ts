import type { ReactNode } from 'react';

import type { BadgeTone } from '../../atoms';

type TimelineItem = {
  id: string;
  tone?: BadgeTone;
  date?: ReactNode;
  dateTime?: string;
  isCurrent?: boolean;
  content: ReactNode;
};

export type TimelineProps = {
  items: readonly TimelineItem[];
  variant?: 'card' | 'plain';
  className?: string;
  'aria-label'?: string;
};
