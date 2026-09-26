import { clsx } from 'clsx';

import type { BandProps } from './Band.types';

import s from './Band.module.scss';

export const Band = ({
  tone = 'deep',
  width = 'wide',
  isDark = true,
  as: Tag = 'section',
  className,
  innerClassName,
  children,
  ...props
}: BandProps) => (
  <Tag className={clsx(s.root, s[tone], className)} data-theme={isDark ? 'dark' : undefined} {...props}>
    <div className={clsx(s.inner, s[width], innerClassName)}>{children}</div>
  </Tag>
);
