import { clsx } from 'clsx';

import type { BandProps } from './Band.types';

import s from './Band.module.scss';

export const Band = ({
  tone = 'deep',
  width = 'wide',
  texture = tone === 'raised' ? 'hex' : 'camo',
  isDark = false,
  as: Tag = 'section',
  className,
  innerClassName,
  children,
  ...props
}: BandProps) => (
  <Tag className={clsx(s.root, s[tone], className)} data-texture={texture} data-theme={isDark ? 'dark' : undefined} {...props}>
    <div className={clsx(s.inner, s[width], innerClassName)}>{children}</div>
  </Tag>
);
