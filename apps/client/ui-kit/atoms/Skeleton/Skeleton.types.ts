import type { ComponentProps } from 'react';

export type SkeletonProps = ComponentProps<'span'> & {
  shape?: 'block' | 'circle' | 'line';
  width?: number | string;
  height?: number | string;
};
