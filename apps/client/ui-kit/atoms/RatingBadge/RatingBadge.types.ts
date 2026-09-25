import type { ComponentProps, ReactNode } from 'react';

import type { RatingTone } from '@/shared/lib';

export type RatingBadgeProps = Omit<ComponentProps<'span'>, 'children'> & {
  tone: RatingTone;
  value: ReactNode;
  label?: string;
  size?: 'lg' | 'md' | 'sm';
  withPips?: boolean;
};
