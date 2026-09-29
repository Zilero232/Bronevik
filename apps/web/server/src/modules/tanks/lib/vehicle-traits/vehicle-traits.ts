import type { TankSource } from '@otmetki/schemas';

import { z } from 'zod';

import type { MatchesTraitsInput, ResearchXpInput, TankSourcesInput } from './vehicle-traits.types';

import { VEHICLE_STATUS } from '../../../reference';

const nextTanksSchema = z.union([
  z.array(z.object({ tankId: z.number().int(), xp: z.number().nonnegative().nullish() })),
  z.record(z.string(), z.number().nonnegative().nullable())
]);

const SOURCE_TAGS: ReadonlyArray<[string, TankSource]> = Object.entries(VEHICLE_STATUS.sourceTags);

export const tankSources = ({ status, spec, hasOffers }: TankSourcesInput): TankSource[] => {
  if (status === 'collector') {
    return ['collectorShop'];
  }

  if (status === 'researchable') {
    return ['techTree'];
  }

  if (status === 'removed') {
    return [];
  }

  const tagged = SOURCE_TAGS.flatMap(([tag, source]) => (spec.tags.includes(tag) ? [source] : []));

  const sources: TankSource[] = [...(spec.notInShop ? [] : (['inGameShop'] as const)), ...(hasOffers ? (['premiumShop'] as const) : []), ...tagged];

  return status === 'reward' && sources.length === 0 ? ['reward'] : sources;
};

export const matchesTraits = ({ traits, filter }: MatchesTraitsInput): boolean =>
  (!filter.statuses?.length || filter.statuses.includes(traits.status)) &&
  (!filter.roles?.length || (traits.role !== null && filter.roles.includes(traits.role)));

export const researchXp = ({ nextTanks, tankId }: ResearchXpInput): number | null => {
  const parsed = nextTanksSchema.safeParse(nextTanks);

  if (!parsed.success) {
    return null;
  }

  if (Array.isArray(parsed.data)) {
    return parsed.data.find((next) => next.tankId === tankId)?.xp ?? null;
  }

  return parsed.data[String(tankId)] ?? null;
};
