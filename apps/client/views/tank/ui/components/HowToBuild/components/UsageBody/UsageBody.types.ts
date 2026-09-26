import type { BuildUsage } from '@otmetki/schemas';

import type { OrderedCrewRole } from '../../../../../lib';

export type UsageBodyProps = {
  usage: BuildUsage;
  crew: OrderedCrewRole[];
};
