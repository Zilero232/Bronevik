import { describe, expect, it } from 'vitest';

import { jobSuccessKey, jobSuccessSchema } from '../job-success';

describe('jobSuccessKey', () => {
  it('keeps two jobs of one queue apart', () => {
    expect(jobSuccessKey({ queue: 'collector.reference', name: 'wn8-expected' })).not.toBe(
      jobSuccessKey({ queue: 'collector.reference', name: 'moe-thresholds' })
    );
  });

  it('keeps one job name in two queues apart', () => {
    expect(jobSuccessKey({ queue: 'collector.poll', name: 'batch' })).not.toBe(jobSuccessKey({ queue: 'collector.sweep', name: 'batch' }));
  });
});

describe('jobSuccessSchema', () => {
  it('refuses a stored value that is not a map of timestamps', () => {
    expect(jobSuccessSchema.safeParse({ 'collector.poll:batch': 'yesterday' }).success).toBe(false);
    expect(jobSuccessSchema.safeParse({ 'collector.poll:batch': '2026-09-29T10:00:00.000Z' }).success).toBe(true);
  });
});
