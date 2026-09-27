import type { PlusFeature } from '@otmetki/schemas';

import type { QueryStateProps } from '@/ui-kit';

import type { AnalyticsQuery } from '../../../model/hooks';

export type AnalyticsStateProps<T> = Pick<QueryStateProps<T>, 'children' | 'empty' | 'isEmpty'> & {
  state: Pick<AnalyticsQuery<T>, 'data' | 'isRetrying' | 'retry' | 'status'>;
  feature?: PlusFeature;
  height?: number;
};
