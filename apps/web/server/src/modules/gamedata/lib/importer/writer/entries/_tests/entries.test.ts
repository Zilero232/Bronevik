import { describe, expect, it } from 'vitest';

import { WRITE } from '../../../importer.constants';
import { createPrisma, plan } from '../../_tests/writer.fixtures';
import { writeEntries } from '../entries';

const entries = (count: number) => Array.from({ length: count }, (_, index) => ({ kind: 'vehicle', key: String(index), data: { index } }));

describe('writeEntries', () => {
  it('replaces the entries of this version only', async () => {
    const prisma = createPrisma();

    await writeEntries({ prisma, plan: plan({ entries: entries(1) }), gameVersionId: 7 });

    expect(prisma.gameDataEntry.deleteMany.mock.calls[0]?.[0]).toEqual({ where: { gameVersionId: 7 } });

    expect(prisma.gameDataEntry.createMany.mock.calls[0]?.[0]).toMatchObject({
      skipDuplicates: true,
      data: [{ gameVersionId: 7, kind: 'vehicle', key: '0' }]
    });
  });

  it('writes large imports in entry-sized batches', async () => {
    const prisma = createPrisma();
    const rows = entries(WRITE.entryBatchSize + 1);

    expect(await writeEntries({ prisma, plan: plan({ entries: rows }), gameVersionId: 7 })).toBe(rows.length);
    expect(prisma.gameDataEntry.createMany).toHaveBeenCalledTimes(2);
  });

  it('stores an entry without data as an empty object', async () => {
    const prisma = createPrisma();

    await writeEntries({ prisma, plan: plan({ entries: [{ kind: 'meta', key: 'k', data: undefined }] }), gameVersionId: 7 });

    expect(prisma.gameDataEntry.createMany.mock.calls[0]?.[0]).toMatchObject({ data: [{ data: {} }] });
  });
});
