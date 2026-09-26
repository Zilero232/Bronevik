import type { PlusFeature } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type PlusGateProps = {
  feature: PlusFeature;
  children: ReactNode;
  fallback?: ReactNode;
};
