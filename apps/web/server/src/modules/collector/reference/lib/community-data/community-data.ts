import { utc } from '@date-fns/utc';
import { masteryThresholds } from '@otmetki/ratings';
import { startOfDay } from 'date-fns';
import { unique } from 'remeda';
import { z } from 'zod';

import type { ExpectedValuesDateInput, MasteryThresholdRow, MoeThresholdRow } from './community-data.types';

import { REFERENCE } from '../../config';
import { EXPECTED_VALUES_HEADER, LESTA_MASTERY } from './community-data.constants';

const threshold = z.coerce.number().int().positive();

const poliroidSchema = z.object({
  data: z.array(
    z.looseObject({
      id: z.coerce.number().int().positive(),
      marks: z.looseObject({ 65: threshold, 85: threshold, 95: threshold })
    })
  )
});

export const parsePoliroidMoe = (input: unknown): MoeThresholdRow[] =>
  poliroidSchema
    .parse(input)
    .data.filter((row) => row.marks[65] < row.marks[85] && row.marks[85] < row.marks[95])
    .map((row) => ({ tankId: row.id, p65: row.marks[65], p85: row.marks[85], p95: row.marks[95] }));

export const masteryThresholdRows = (distribution: Readonly<Record<string, Readonly<Record<string, number>>>>): MasteryThresholdRow[] =>
  Object.entries(distribution).flatMap(([tankId, percentiles]) => {
    const thresholds = masteryThresholds(percentiles);

    if (!thresholds) {
      return [];
    }

    return [{ tankId: Number(tankId), class3: thresholds.third, class2: thresholds.second, class1: thresholds.first, master: thresholds.ace }];
  });

export const expectedValuesDate = ({ header, now }: ExpectedValuesDateInput): Date => {
  const version = typeof header.version === 'string' ? header.version : '';
  const match = EXPECTED_VALUES_HEADER.isoDayPattern.exec(version);

  return match ? new Date(`${match[0]}T00:00:00Z`) : startOfDay(now, { in: utc });
};

export const masteryPercentiles = (required: readonly number[]): number[] =>
  unique([...required, ...REFERENCE.masteryPercentiles])
    .toSorted((left, right) => left - right)
    .slice(0, LESTA_MASTERY.maxPercentiles);
