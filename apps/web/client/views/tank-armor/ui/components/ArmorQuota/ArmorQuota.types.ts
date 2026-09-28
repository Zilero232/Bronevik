import type { UsageAudience } from '@otmetki/schemas';

export type ArmorQuotaProps = {
  audience: UsageAudience;
  remaining: number;
  limit: number;
  freeLimit: number;
  resetsOn: string;
};
