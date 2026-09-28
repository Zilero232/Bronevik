import type { UsageAudience } from '@otmetki/schemas';

export type ArmorLimitProps = {
  audience: UsageAudience;
  limit: number;
  freeLimit: number;
  resetsOn: string;
};
