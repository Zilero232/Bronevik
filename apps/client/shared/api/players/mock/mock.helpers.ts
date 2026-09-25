import type { RatingScale } from '@bronevik/ratings';
import type { RatingValue, StatsBlock, VehicleSummary } from '@bronevik/schemas';

import { ratingTier } from '@bronevik/ratings';
import { subDays } from 'date-fns';

import type { MockTank } from '@/shared/mocks';

import type { MockRatingInput, MockStatsInput } from './mock.types';

export const round = (value: number, digits = 0) => {
  const factor = 10 ** digits;

  return Math.round(value * factor) / factor;
};

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const hashString = (value: string) => {
  let hash = 2_166_136_261;

  for (const char of value.toLowerCase()) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16_777_619);
  }

  return hash >>> 0;
};

export const mockUuid = (random: () => number) => {
  const hex = (length: number) => Array.from({ length }, () => Math.floor(random() * 16).toString(16)).join('');

  return `${hex(8)}-${hex(4)}-4${hex(3)}-8${hex(3)}-${hex(12)}`;
};

export const isoDaysAgo = (days: number) => subDays(new Date(), days).toISOString();

export const isoDateDaysAgo = (days: number) => isoDaysAgo(days).slice(0, 10);

export const mockRating = ({ scale, value }: MockRatingInput): RatingValue => ({
  value: round(value),
  tier: ratingTier({ scale, value })
});

const SCALE_OF = { wn8: 'wn8', eff: 'eff', broneIndex: 'bronyaIndex' } as const satisfies Record<string, RatingScale>;

export const mockStatsBlock = ({ battles, winRate, avgDamage, wn8, broneIndex, random }: MockStatsInput): StatsBlock => ({
  battles,
  winRate: round(clamp(winRate, 0, 100), 2),
  avgDamage: round(avgDamage),
  avgFrags: round(0.55 + wn8 / 3200 + random() * 0.15, 2),
  avgSpotted: round(0.7 + random() * 0.9, 2),
  avgXp: round(avgDamage * 0.27 + 210),
  avgBlocked: round(avgDamage * (0.2 + random() * 0.25)),
  avgAssisted: round(avgDamage * (0.2 + random() * 0.2)),
  survivalRate: clamp(round(20 + wn8 / 90 + random() * 8, 1), 0, 100),
  accuracy: clamp(round(66 + random() * 16, 1), 0, 100),
  avgTier: round(6.4 + random() * 2.9, 2),
  wn8: mockRating({ scale: SCALE_OF.wn8, value: wn8 }),
  eff: mockRating({ scale: SCALE_OF.eff, value: 500 + wn8 * 0.52 }),
  broneIndex: mockRating({ scale: SCALE_OF.broneIndex, value: broneIndex })
});

export const mockVehicle = ({ id, name, slug, nation, type, tier, isPremium, images }: MockTank): VehicleSummary => ({
  tankId: id,
  name,
  shortName: name,
  slug,
  nation,
  type,
  tier,
  isPremium,
  isCollectible: false,
  images
});
