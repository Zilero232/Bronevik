import { masteryThresholds } from '@bronevik/ratings';
import { utc } from '@date-fns/utc';
import { startOfDay } from 'date-fns';
import { z } from 'zod';

import type { ExpectedValuesDateInput, MasteryThresholdRow, MoeThresholdRow } from './community-data.types';

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

const isoDay = /^\d{4}-\d{2}-\d{2}/;

export const expectedValuesDate = ({ header, now }: ExpectedValuesDateInput): Date => {
  const version = typeof header.version === 'string' ? header.version : '';
  const match = isoDay.exec(version);

  return match ? new Date(`${match[0]}T00:00:00Z`) : startOfDay(now, { in: utc });
};
