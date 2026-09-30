import { HydrationBoundary } from '@tanstack/react-query';
import { connection } from 'next/server';

import type { PrefetchBoundaryProps } from './PrefetchBoundary.types';

export const PrefetchBoundary = async ({ state, children }: PrefetchBoundaryProps) => {
  const dehydrated = await state.catch(() => null);

  if (dehydrated === null) {
    await connection();
  }

  return <HydrationBoundary state={dehydrated ?? undefined}>{children}</HydrationBoundary>;
};
