import { chunk } from 'remeda';

import type { Prisma } from '../../../../../../generated';
import type { InBatchesInput } from '../importer.types';

import { WRITE } from '../importer.constants';

export const toStoredJson = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {}));

export const inBatches = async <T>({ items, size = WRITE.batchSize, run }: InBatchesInput<T>): Promise<number> => {
  for (const batch of chunk(items, size)) {
    await run(batch);
  }

  return items.length;
};
