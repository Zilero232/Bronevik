import type { DehydratedState } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export type PrefetchBoundaryProps = {
  state: Promise<DehydratedState | null>;
  children: ReactNode;
};
