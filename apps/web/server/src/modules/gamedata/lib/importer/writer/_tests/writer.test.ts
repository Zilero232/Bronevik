import { describe, expect, it, vi } from 'vitest';

import { writeImportPlan } from '../writer';
import { createPrisma, plan, summary, vehicleRow } from './writer.fixtures';

const entries = (count: number) => Array.from({ length: count }, (_, index) => ({ kind: 'vehicle', key: String(index), data: { index } }));

describe('writeImportPlan', () => {
  it('stores only the version and raw entries in snapshot mode', async () => {
    const prisma = createPrisma(7);

    const counts = await writeImportPlan({
      prisma,
      plan: plan({ entries: entries(2), vehicles: [vehicleRow(1)], summaries: new Map([[1, summary()]]) }),
      mode: 'snapshot',
      markCurrent: false
    });

    expect(counts).toMatchObject({ gameVersionId: 7, entries: 2, vehicles: 0, specHistory: 0 });
    expect(prisma.vehicle.upsert).not.toHaveBeenCalled();
    expect(prisma.vehicleSpecHistory.upsert).not.toHaveBeenCalled();
  });

  it('writes the catalogue and spec history in full mode', async () => {
    const prisma = createPrisma(7);

    const counts = await writeImportPlan({
      prisma,
      plan: plan({ vehicles: [vehicleRow(1)], summaries: new Map([[1, summary()]]) }),
      mode: 'full',
      markCurrent: true
    });

    expect(counts).toMatchObject({ gameVersionId: 7, vehicles: 1, specHistory: 1, changedVehicles: 0 });
  });

  it('reports progress when asked', async () => {
    const onProgress = vi.fn();

    await writeImportPlan({ prisma: createPrisma(), plan: plan(), mode: 'full', markCurrent: false, onProgress });

    expect(onProgress).toHaveBeenCalled();
    expect(onProgress.mock.calls.every(([message]) => typeof message === 'string' && message.length > 0)).toBe(true);
  });
});
