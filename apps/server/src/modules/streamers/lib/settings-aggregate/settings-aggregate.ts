import { STREAMER_SETTINGS_AGGREGATE_FIELDS, zoomMax } from '@otmetki/schemas';
import { countBy, entries, sortBy } from 'remeda';
import { z } from 'zod';

import type { AggregateCohortInput, AggregateRow, BucketOfInput, ReadPathInput, ValueOfInput } from './settings-aggregate.types';

import { readRecord } from '../../../../common/lib';

const readPath = ({ source, path }: ReadPathInput): unknown => path.split('.').reduce<unknown>((value, key) => readRecord(value)[key], source);

const zoomStepsOf = (values: ValueOfInput['values']): string[] | undefined => {
  const parsed = z.array(z.string()).safeParse(readPath({ source: values, path: 'zoom.steps' }));

  return parsed.success ? parsed.data : undefined;
};

const valueOf = ({ values, field }: ValueOfInput): unknown =>
  field === 'zoom.max' ? zoomMax(zoomStepsOf(values)) : readPath({ source: values, path: field });

const median = (numbers: readonly number[]): number | null => {
  const sorted = [...numbers].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length === 0) {
    return null;
  }

  return sorted.length % 2 === 1 ? (sorted[middle] ?? null) : ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
};

const bucketOf = ({ spec, value }: BucketOfInput): string | null => {
  if (spec.kind === 'numeric') {
    return typeof value === 'number' ? (Math.floor(value / spec.step) * spec.step).toFixed(2) : null;
  }

  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : null;
};

export const aggregateCohort = ({ contributions, minCohort, fields = STREAMER_SETTINGS_AGGREGATE_FIELDS }: AggregateCohortInput): AggregateRow[] =>
  fields.flatMap((spec) => {
    const values = contributions.map((values) => valueOf({ values, field: spec.field }));
    const buckets = values.flatMap((value) => {
      const bucket = bucketOf({ spec, value });

      return bucket === null ? [] : [bucket];
    });

    if (buckets.length < minCohort) {
      return [];
    }

    const numbers = spec.kind === 'numeric' ? values.filter((value): value is number => typeof value === 'number') : [];

    return {
      field: spec.field,
      kind: spec.kind,
      contributors: buckets.length,
      median: spec.kind === 'numeric' ? median(numbers) : null,
      buckets: sortBy(
        entries(countBy(buckets, (bucket) => bucket)).map(([bucket, count]) => ({ bucket, count })),
        [(row) => row.count, 'desc']
      )
    };
  });
