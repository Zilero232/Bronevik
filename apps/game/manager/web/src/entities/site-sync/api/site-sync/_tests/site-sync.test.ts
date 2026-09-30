import report from '@contract/sync-report.json';
import status from '@contract/sync-status.json';
import { describe, expect, it } from 'vitest';

import { syncReportSchema, syncStatusSchema } from '@/entities/site-sync';

describe('syncStatusSchema', () => {
  it('parses the local sync state of sets and profiles', () => {
    const parsed = syncStatusSchema.parse(status);

    expect(parsed.linked).toBe(true);
    expect(parsed.profiles?.syncedAt).toBeNull();
  });
});

describe('syncReportSchema', () => {
  it('parses a sync that stopped on a conflict for one library only', () => {
    const parsed = syncReportSchema.parse(report);

    expect(parsed.sets.outcome).toBe('conflict');
    expect(parsed.profiles?.outcome).toBe('pushed');
  });
});
