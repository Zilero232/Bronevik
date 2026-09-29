import type { ComponentProps } from 'react';

export type BadgeTone = 'accent' | 'battle' | 'brass' | 'danger' | 'gold' | 'neutral' | 'olive' | 'premium' | 'sky' | 'steel' | 'success' | 'warning';

type BadgeShape = 'corner' | 'pill' | 'plate' | 'ribbon';

export type BadgeProps = ComponentProps<'span'> & {
  tone?: BadgeTone;
  shape?: BadgeShape;
};
