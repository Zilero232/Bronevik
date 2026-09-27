import { Job } from 'bullmq';
import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { MetricsService } from '../../../collector/metrics';
import type { CompetitionScoringService } from '../../services';

import { COMPETITION_QUEUE } from '../../config';
import { CompetitionsProcessor } from '../competitions.processor';

const trackingMetrics = () => mock<MetricsService>({ track: async ({ run }) => run() });

describe('CompetitionsProcessor.process', () => {
  it('runs scoring for a score job and ignores unknown jobs', async () => {
    const scoring = mock<CompetitionScoringService>();
    const processor = new CompetitionsProcessor(scoring, trackingMetrics());

    scoring.run.mockResolvedValue(2);

    expect(await processor.process(mock<Job>({ name: COMPETITION_QUEUE.jobs.score }))).toBe(2);
    expect(await processor.process(mock<Job>({ name: 'unknown' }))).toBeNull();
    expect(scoring.run).toHaveBeenCalledTimes(1);
  });
});
