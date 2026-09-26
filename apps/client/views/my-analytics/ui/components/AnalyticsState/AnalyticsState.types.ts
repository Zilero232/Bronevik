import type { PlusFeature } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import type { AnalyticsStatus } from '../../../lib/analytics-status';

export type AnalyticsStateProps<T> = {
  status: AnalyticsStatus;
  data: T | undefined;
  feature?: PlusFeature;
  isRetrying: boolean;
  height?: number;
  onRetry: () => void;
  children: (data: T) => ReactNode;
};
