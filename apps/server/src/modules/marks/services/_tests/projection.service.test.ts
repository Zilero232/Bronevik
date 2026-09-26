import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { MoeThreshold } from '../../../../../generated';
import type { ThresholdsService } from '../../../reference';

import { ProjectionService } from '../projection.service';

const threshold: MoeThreshold = {
  tankId: 1,
  date: new Date('2026-09-20'),
  source: 'otmetki',
  p65: 2_000,
  p85: 2_600,
  p95: 3_100,
  p100: null,
  sampleSize: null,
  capturedAt: new Date('2026-09-20')
};

const input = { tankId: 1, currentPercent: 60, targetMarks: 3, avgDamage: 3_500 };

const createService = (moe: MoeThreshold | null) => {
  const thresholds = mock<ThresholdsService>();

  thresholds.moe.mockResolvedValue(moe);

  return new ProjectionService(thresholds);
};

describe('ProjectionService.project', () => {
  it('echoes the input and projects the battles needed when thresholds exist', async () => {
    const result = await createService(threshold).project(input);

    expect(result).toMatchObject(input);
    expect(result.battlesNeeded).toBeGreaterThan(0);
  });

  it('needs more battles for a higher mark', async () => {
    const service = createService(threshold);

    const two = await service.project({ ...input, targetMarks: 2 });
    const three = await service.project(input);

    expect(three.battlesNeeded).toBeGreaterThan(two.battlesNeeded ?? Number.POSITIVE_INFINITY);
  });

  it('returns no projection when the tank has no thresholds', async () => {
    await expect(createService(null).project(input)).resolves.toEqual({ ...input, battlesNeeded: null });
  });
});
