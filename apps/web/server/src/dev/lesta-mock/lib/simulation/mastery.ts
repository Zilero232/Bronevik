import { MASTERY_PERCENTILES } from '@otmetki/ratings';

import type {
  MasteryLevelInput,
  MasteryThresholds,
  MasteryThresholdsInput,
  PercentileOfInput,
  PopulationSample,
  PopulationSampleInput
} from './simulation.types';

import { MOCK_SALT, MOCK_SKILL } from '../../config';
import { createRng } from '../random';
import { simulateBattle } from './battle';

const SAMPLES = 1200;

const samples = new Map<string, PopulationSample>();

const ascending = (values: number[]): number[] => values.sort((left, right) => left - right);

export const percentileOf = ({ sorted, percentile }: PercentileOfInput): number =>
  sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor((percentile / 100) * sorted.length)))] ?? 0;

export const populationSample = ({ seed, vehicle }: PopulationSampleInput): PopulationSample => {
  const key = `${seed}:${vehicle.tankId}`;
  const cached = samples.get(key);

  if (cached) {
    return cached;
  }

  const rng = createRng(seed, MOCK_SALT.base, vehicle.tankId, SAMPLES);
  const battles = Array.from({ length: SAMPLES }, () => {
    const perf =
      Math.exp(MOCK_SKILL.damageMu + MOCK_SKILL.damageSigma * rng.normal()) * rng.logNormal({ median: 1, sigma: MOCK_SKILL.affinitySigma });

    const winChance = Math.min(0.75, Math.max(0.3, 0.49 + 0.03 * rng.normal()));

    return simulateBattle({ rng, vehicle, perf, winChance, endedAt: 0, durationSec: 420, mode: 'random', premiumAccount: false });
  });

  const sample = {
    xp: ascending(battles.map((battle) => battle.xp)),
    damage: ascending(battles.map((battle) => battle.damageDealt)),
    frags: ascending(battles.map((battle) => battle.frags))
  };

  samples.set(key, sample);

  return sample;
};

export const masteryThresholds = ({ seed, vehicle }: MasteryThresholdsInput): MasteryThresholds => {
  const { xp } = populationSample({ seed, vehicle });

  return {
    third: percentileOf({ sorted: xp, percentile: MASTERY_PERCENTILES.third }),
    second: percentileOf({ sorted: xp, percentile: MASTERY_PERCENTILES.second }),
    first: percentileOf({ sorted: xp, percentile: MASTERY_PERCENTILES.first }),
    ace: percentileOf({ sorted: xp, percentile: MASTERY_PERCENTILES.ace })
  };
};

export const masteryLevel = ({ thresholds, maxXp }: MasteryLevelInput): number =>
  [thresholds.third, thresholds.second, thresholds.first, thresholds.ace].filter((value) => maxXp >= value).length;
