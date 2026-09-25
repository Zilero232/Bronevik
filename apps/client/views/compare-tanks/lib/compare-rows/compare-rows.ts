import { clamp, isNumber } from 'remeda';

import { isLowerBetter, specBest, TANK_SPEC_GROUPS, TANK_SPEC_KEYS, TANK_SPECS } from '@/entities/tank/tank';

import type { CompareCell, CompareRowInput, RatioToBestInput, SpecSection, SpecSectionsInput } from './compare-rows.types';

const ratioToBest = ({ value, reference, isLower }: RatioToBestInput): number | null => {
  if (!isNumber(value) || reference === null || reference <= 0 || value < 0) {
    return null;
  }

  if (isLower) {
    return value === 0 ? 1 : clamp(reference / value, { min: 0, max: 1 });
  }

  return clamp(value / reference, { min: 0, max: 1 });
};

export const compareRow = ({ key, values }: CompareRowInput): CompareCell[] => {
  const best = specBest({ key, values });
  const reference = best ?? values.find(isNumber) ?? null;
  const isLower = isLowerBetter(key);

  return values.map((value) => ({
    value,
    ratio: ratioToBest({ value, reference, isLower }),
    isBest: best !== null && value === best
  }));
};

export const specSections = ({ specs }: SpecSectionsInput): SpecSection[] =>
  TANK_SPEC_GROUPS.map((group) => ({
    group,
    rows: TANK_SPEC_KEYS.filter((key) => TANK_SPECS[key].group === group)
      .map((key) => ({ key, cells: compareRow({ key, values: specs.map((spec) => spec[key] ?? null) }) }))
      .filter(({ cells }) => cells.some(({ value }) => value !== null))
  })).filter(({ rows }) => rows.length > 0);
