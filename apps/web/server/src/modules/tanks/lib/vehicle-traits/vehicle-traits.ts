import type { TankRole, TankSource, TankStatus, TankTraits } from '@otmetki/schemas';

import { TANK_ROLES } from '@otmetki/schemas';
import { isIncludedIn } from 'remeda';
import { z } from 'zod';

import type { ClassifyVehicleInput, MatchesTraitsInput, ResearchXpInput, SpecTraits, TankSourcesInput } from './vehicle-traits.types';

import { TANK_TRAITS } from '../../config';

const specTraitsSchema = z.object({
  tags: z.array(z.string()).catch([]),
  role: z.string().nullish().catch(null),
  notInShop: z.boolean().catch(false)
});

const nextTanksSchema = z.union([
  z.array(z.object({ tankId: z.number().int(), xp: z.number().nonnegative().nullish() })),
  z.record(z.string(), z.number().nonnegative().nullable())
]);

const SOURCE_TAGS: ReadonlyArray<[string, TankSource]> = Object.entries(TANK_TRAITS.sourceTags);

export const readSpecTraits = (specs: unknown): SpecTraits => {
  const parsed = specTraitsSchema.safeParse(specs);

  return parsed.success
    ? { tags: parsed.data.tags, role: parsed.data.role ?? null, notInShop: parsed.data.notInShop }
    : { tags: [], role: null, notInShop: false };
};

export const toTankRole = (role: string | null): TankRole | null => {
  if (!role?.startsWith(TANK_TRAITS.rolePrefix)) {
    return null;
  }

  const name = role.slice(TANK_TRAITS.rolePrefix.length);

  return isIncludedIn(name, TANK_ROLES) ? name : null;
};

const hasRewardTag = (tags: readonly string[]): boolean =>
  tags.some((tag) => isIncludedIn(tag, TANK_TRAITS.rewardTags) || SOURCE_TAGS.some(([sourceTag]) => sourceTag === tag));

export const classifyVehicle = ({ summary, spec, hasOffers }: ClassifyVehicleInput): TankStatus => {
  if (summary.isCollectible) {
    return 'collector';
  }

  if (!summary.isPremium) {
    return spec.notInShop ? 'removed' : 'researchable';
  }

  if (!spec.notInShop || hasOffers) {
    return 'premium';
  }

  return summary.tier >= TANK_TRAITS.rewardMinTier || hasRewardTag(spec.tags) ? 'reward' : 'premium';
};

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

export const toTankTraits = (input: ClassifyVehicleInput): TankTraits => ({
  status: classifyVehicle(input),
  role: toTankRole(input.spec.role)
});

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
