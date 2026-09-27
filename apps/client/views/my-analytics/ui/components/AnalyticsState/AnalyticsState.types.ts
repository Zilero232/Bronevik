import type { PlusFeature } from '@otmetki/schemas';

import type { QueryStateProps } from '@/ui-kit';

import type { useAnalyticsQuery } from '../../../model/hooks/use-analytics-query';

export type AnalyticsStateProps<T> = Pick<QueryStateProps<T>, 'children' | 'empty' | 'isEmpty'> & {
  state: Pick<ReturnType<typeof useAnalyticsQuery<T>>, 'data' | 'isRetrying' | 'retry' | 'status'>;
  feature?: PlusFeature;
  height?: number;
};
