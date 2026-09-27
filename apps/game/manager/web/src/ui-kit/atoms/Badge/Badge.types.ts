import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import type { badgeVariants } from './Badge.variants';

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>['tone']>;

export type BadgeProps = {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
};
