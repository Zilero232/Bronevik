import type { BadgeProps } from './Badge.types';

import { badgeVariants } from './Badge.variants';

export const Badge = ({ tone = 'neutral', icon, children }: BadgeProps) => (
  <span className={badgeVariants({ tone })}>
    {icon}
    {children}
  </span>
);
