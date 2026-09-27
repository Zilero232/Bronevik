import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { VehicleSpecHistory } from '../../../../../../../../generated';

import { WRITE } from '../../../importer.constants';
import { createPrisma, plan, summary } from '../../_tests/writer.fixtures';
import { writeSpecHistory } from '../spec-history';

const GAME_VERSION_ID = 7;

const stored = (tankId: number, specs: unknown) => mock<VehicleSpecHistory>({ tankId, specs: JSON.parse(JSON.stringify(specs)) });

describe('writeSpecHistory', () => {
  it('stores a first-seen vehicle without a diff and does not count it as changed', async () => {
    const prisma = createPrisma();

    const result = await writeSpecHistory({ prisma, plan: plan({ summaries: new Map([[1, summary()]]) }), gameVersionId: GAME_VERSION_ID });

    expect(result).toEqual({ specHistory: 1, changedVehicles: 0 });
    expect(prisma.vehicleSpecHistory.upsert.mock.calls[0]?.[0].create.diff).toBeUndefined();
  });

  it('counts only vehicles whose specs really changed since the previous version', async () => {
    const prisma = createPrisma();

    prisma.vehicleSpecHistory.findMany.mockResolvedValue([stored(1, summary()), stored(2, summary())]);

    const result = await writeSpecHistory({
      prisma,
      plan: plan({
        summaries: new Map([
          [1, summary()],
          [2, summary({ speed: { forward: 40, backward: 12 } })]
        ])
      }),
      gameVersionId: GAME_VERSION_ID
    });

    expect(result).toEqual({ specHistory: 2, changedVehicles: 1 });

    const [unchanged, changed] = prisma.vehicleSpecHistory.upsert.mock.calls.map(([args]) => args.create.diff);

    expect(unchanged).toEqual([]);
    expect(changed).toEqual([{ path: 'speed.forward', before: 35, after: 40 }]);
  });

  it('compares against earlier versions only, so a re-import is idempotent', async () => {
    const prisma = createPrisma();

    await writeSpecHistory({ prisma, plan: plan(), gameVersionId: GAME_VERSION_ID });

    expect(prisma.vehicleSpecHistory.findMany.mock.calls[0]?.[0]?.where).toEqual({ gameVersionId: { not: GAME_VERSION_ID } });
  });

  it('writes in batches of the configured size', async () => {
    const prisma = createPrisma();
    const summaries = new Map(Array.from({ length: WRITE.batchSize + 1 }, (_, index) => [index + 1, summary()]));

    const result = await writeSpecHistory({ prisma, plan: plan({ summaries }), gameVersionId: GAME_VERSION_ID });

    expect(result.specHistory).toBe(summaries.size);
    expect(prisma.$transaction).toHaveBeenCalledTimes(2);
  });
});
