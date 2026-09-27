import type { MoeFeedInput } from '../../api';
import type { MoeFeedParamsInput } from './moe-feed-params.types';

import { MOE_LIST } from '../../config';

export const moeFeedParams = ({ vehicle, sort, order }: MoeFeedParamsInput): MoeFeedInput => ({
  ...vehicle,
  sort,
  order,
  limit: MOE_LIST.pageLimit
});
