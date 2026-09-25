import type { PopularBuilds } from '@bronevik/schemas';

import { seededRandom } from '@/shared/lib';
import { findMockVehicle } from '@/shared/mocks';

import type { MockPopularInput } from './mock.types';

import { MOCK_PROVISIONS, provisionOption } from './mock-catalog';
import { MOCK_BUILD } from './mock.constants';

const optionsOf = (ids: readonly number[]) => MOCK_PROVISIONS.filter(({ id }) => ids.includes(id)).map(provisionOption);

export const mockPopularBuilds = ({ tankId, limit }: MockPopularInput): PopularBuilds => {
  const tank = findMockVehicle(tankId);

  if (!tank) {
    return { tankId, source: 'none', sampleSize: 0, builds: [] };
  }

  const random = seededRandom(tankId + 77);
  const sampleSize = Math.round(tank.battles / 400);

  const builds = MOCK_BUILD.popular.slice(0, limit).map(({ optionalDevices, consumables, directives }, index) => {
    const share = Math.round((0.34 - index * 0.1 + random() * 0.03) * 1000) / 1000;

    return {
      optionalDevices: optionsOf(optionalDevices),
      consumables: optionsOf(consumables),
      directives: optionsOf(directives),
      battles: Math.round(sampleSize * share),
      share,
      winRate: Math.round((tank.winRate + 1.5 - index * 0.6 + random()) * 100) / 100,
      avgDamage: Math.round(tank.avgDamage * (1.12 - index * 0.04))
    };
  });

  return { tankId, source: 'battles', sampleSize, builds };
};
