import reports from '@contract/patch-reports.json';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { patchReportSchema } from '@/entities/patch-report';

describe('patchReportSchema', () => {
  it('parses every status the background check can report', () => {
    const parsed = z.array(patchReportSchema).parse(reports);
    const kinds = new Set(parsed.map((report) => report.status.kind));

    expect(kinds.size).toBe(parsed.length);
    expect(kinds).toContain('waiting');
  });
});
