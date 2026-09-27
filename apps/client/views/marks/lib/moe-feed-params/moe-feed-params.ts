import type { MoeFeedParams } from '../../api';
import type { MoeFeedParamsInput } from './moe-feed-params.types';

import { MOE_LIST } from '../../config';

export const moeFeedParams = ({ vehicle, sort, order }: MoeFeedParamsInput): MoeFeedParams => ({
  ...vehicle,
  sort,
  order,
  limit: MOE_LIST.pageLimit
});
