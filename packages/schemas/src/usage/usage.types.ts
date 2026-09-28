import type { z } from 'zod';

import type { usageAudienceSchema, usageMeterKeySchema, usageMeterStateSchema, usageSchema } from './usage.schemas';

export type UsageMeterKey = z.infer<typeof usageMeterKeySchema>;
export type UsageAudience = z.infer<typeof usageAudienceSchema>;
export type UsageMeterState = z.infer<typeof usageMeterStateSchema>;
export type Usage = z.infer<typeof usageSchema>;

export type UsageLimitInput = {
  meter: UsageMeterKey;
  audience: UsageAudience;
};
