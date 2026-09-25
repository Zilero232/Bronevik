import type { ComponentProps } from 'react';

export type BadgeTone = 'accent' | 'danger' | 'neutral' | 'solid' | 'steel' | 'success' | 'warning';

export type BadgeProps = ComponentProps<'span'> & {
  tone?: BadgeTone;
};
