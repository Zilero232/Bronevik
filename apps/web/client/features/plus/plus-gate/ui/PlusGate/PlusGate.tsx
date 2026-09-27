'use client';

import { Skeleton } from '@/ui-kit';

import type { PlusGateProps } from './PlusGate.types';

import { PLUS_GATE } from '../../config';
import { usePlus } from '../../model/hooks';
import { PlusTeaser } from '../PlusTeaser';

export const PlusGate = ({ feature, children, fallback }: PlusGateProps) => {
  const { isPlus, isPending } = usePlus();

  if (isPending) {
    return <Skeleton height={PLUS_GATE.skeletonHeight} shape='block' />;
  }

  if (isPlus) {
    return children;
  }

  return fallback ?? <PlusTeaser feature={feature} />;
};
