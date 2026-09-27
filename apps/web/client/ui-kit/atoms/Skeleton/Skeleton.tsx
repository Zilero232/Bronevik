import { clsx } from 'clsx';
import { times } from 'remeda';

import type { SkeletonProps } from './Skeleton.types';

import s from './Skeleton.module.scss';

export const Skeleton = ({ count = 1, shape = 'line', width, height, className, style, ...props }: SkeletonProps) =>
  times(count, (index) => (
    <span aria-hidden key={index} className={clsx(s.root, s[shape], className)} style={{ width, height, ...style }} {...props} />
  ));
