import type { ComponentProps } from 'react';

export type BadgeTone = 'accent' | 'danger' | 'neutral' | 'premium' | 'steel' | 'success' | 'warning';

export type BadgeShape = 'corner' | 'pill' | 'plate' | 'ribbon';

export type BadgeProps = ComponentProps<'span'> & {
  tone?: BadgeTone;
  shape?: BadgeShape;
};
