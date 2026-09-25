import { clsx } from 'clsx';

import type { SkeletonProps } from './Skeleton.types';

import s from './Skeleton.module.scss';

export const Skeleton = ({ shape = 'line', width, height, className, style, ...props }: SkeletonProps) => (
  <span aria-hidden className={clsx(s.root, s[shape], className)} style={{ width, height, ...style }} {...props} />
);
