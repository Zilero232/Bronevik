import type { HonestRng } from '@/shared/api/generated';

export type { HonestRng, HonestRngMine } from '@/shared/api/generated';

export type HonestRngInput = {
  period: HonestRng['period'];
  signal?: AbortSignal;
};
