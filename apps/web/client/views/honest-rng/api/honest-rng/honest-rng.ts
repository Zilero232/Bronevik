import { honestRngControllerMine, honestRngControllerView } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { HonestRng, HonestRngInput, HonestRngMine } from './honest-rng.types';

export const getHonestRng = ({ period, signal }: HonestRngInput): Promise<HonestRng> =>
  fromSdk(() => honestRngControllerView({ query: { period }, signal }));

export const getMyHonestRng = ({ period, signal }: HonestRngInput): Promise<HonestRngMine> =>
  fromSdk(() => honestRngControllerMine({ query: { period }, signal }));
