import type { UsageLimitInput } from './usage.types';

import { USAGE_METERS } from './usage.constants';

export const usageLimit = ({ meter, audience }: UsageLimitInput): number | null => USAGE_METERS[meter][audience];
