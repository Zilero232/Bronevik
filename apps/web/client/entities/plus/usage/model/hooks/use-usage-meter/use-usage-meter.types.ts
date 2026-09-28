import type { UsageMeterKey } from '@otmetki/schemas';

export type UseUsageMeterInput = {
  meter: UsageMeterKey;
  enabled?: boolean;
};
