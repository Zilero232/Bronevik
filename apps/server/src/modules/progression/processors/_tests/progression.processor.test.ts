import { Job } from 'bullmq';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { PROGRESSION_QUEUE } from '../../config';
import { ProgressionRunService } from '../../services';
import { ProgressionProcessor } from '../progression.processor';

const now = new Date('2026-09-26T10:00:00Z');

const job = (name: string) => mock<Job>({ name });

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(now);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ProgressionProcessor.process', () => {
  it('runs progression at the current time for the run job', async () => {
    const runs = mock<ProgressionRunService>();

    runs.run.mockResolvedValue(3);

    expect(await new ProgressionProcessor(runs).process(job(PROGRESSION_QUEUE.jobs.run))).toBe(3);
    expect(runs.run).toHaveBeenCalledWith(now);
  });

  it('ignores unknown jobs', async () => {
    const runs = mock<ProgressionRunService>();

    expect(await new ProgressionProcessor(runs).process(job('unknown'))).toBeNull();
    expect(runs.run).not.toHaveBeenCalled();
  });
});
