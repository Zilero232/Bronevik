import conflicts from '@contract/conflicts.json';
import { describe, expect, it } from 'vitest';

import { conflictReportSchema } from '@/entities/conflict';

describe('conflictReportSchema', () => {
  it('parses the conflict report the Rust core serves', () => {
    const report = conflictReportSchema.parse(conflicts);

    expect(report.missing[0]?.snapshot).not.toBeNull();
    expect(report.overrides.map((entry) => entry.location)).toEqual(['res_mods']);
    expect(report.foreign[0]?.components).toEqual(['damage_log']);
  });
});
