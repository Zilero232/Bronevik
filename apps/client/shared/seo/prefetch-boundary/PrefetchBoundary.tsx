import { HydrationBoundary } from '@tanstack/react-query';

import type { PrefetchBoundaryProps } from './PrefetchBoundary.types';

export const PrefetchBoundary = async ({ state, children }: PrefetchBoundaryProps) => (
  <HydrationBoundary state={await state.catch(() => undefined)}>{children}</HydrationBoundary>
);
