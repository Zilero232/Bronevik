import { clamp, isNumber } from 'remeda';

import { isLowerBetter, specBest, specDelta, TANK_SPEC_GROUPS, TANK_SPEC_KEYS, TANK_SPECS } from '@/entities/tank/tank';

import type {
  BarFillInput,
  BuildSide,
  BuildStatGroupsInput,
  MinusInput,
  ReadSpecInput,
  StatGroup,
  StatRow,
  StatRowInput,
  WinnerInput
} from './stat-diff.types';

import { STAT_BAR } from './stat-diff.constants';

const read = ({ specs, key }: ReadSpecInput) => {
  const value = specs?.[key];

  return isNumber(value) ? value : null;
};

const minus = ({ after, before }: MinusInput) => (after !== null && before !== null ? after - before : null);

export const barFill = ({ key, value, base }: BarFillInput): number => {
  if (value === null || base === null || value <= 0 || base <= 0) {
    return 0;
  }

  const ratio = isLowerBetter(key) ? base / value : value / base;

  return clamp(ratio * STAT_BAR.baseMark, { min: STAT_BAR.min, max: 1 });
};

const winnerOf = ({ key, a, b }: WinnerInput): BuildSide | null => {
  const best = specBest({ key, values: [a, b] });

  if (best === null) {
    return null;
  }

  return best === a ? 'a' : 'b';
};

const statRow = ({ key, specs }: StatRowInput): StatRow => {
  const { base: baseSpecs, a: aSpecs, b: bSpecs } = specs;
  const base = read({ specs: baseSpecs, key });
  const a = read({ specs: aSpecs, key });
  const b = bSpecs ? read({ specs: bSpecs, key }) : null;

  return {
    key,
    base,
    a,
    b,
    delta: minus({ after: a, before: base }),
    verdict: specDelta({ key, before: base, after: a }),
    verdictB: specDelta({ key, before: base, after: b }),
    diff: minus({ after: b, before: a }),
    diffVerdict: specDelta({ key, before: a, after: b }),
    sideVerdictA: bSpecs ? specDelta({ key, before: b, after: a }) : null,
    sideVerdictB: bSpecs ? specDelta({ key, before: a, after: b }) : null,
    winner: bSpecs ? winnerOf({ key, a, b }) : null,
    fill: barFill({ key, value: a, base }),
    fillB: bSpecs ? barFill({ key, value: b, base }) : null
  };
};

export const buildStatGroups = (input: BuildStatGroupsInput): StatGroup[] =>
  TANK_SPEC_GROUPS.map((group) => ({
    group,
    rows: TANK_SPEC_KEYS.filter((key) => TANK_SPECS[key].group === group && read({ specs: input.a, key }) !== null).map((key) =>
      statRow({ key, specs: input })
    )
  })).filter(({ rows }) => rows.length > 0);
