import type { AggregateField } from '@otmetki/schemas';

import type { AggregateShare } from '../../../../../lib/aggregate-shares';

export type AggregateFieldCardProps = {
  field: AggregateField & { shares: AggregateShare[] };
};
