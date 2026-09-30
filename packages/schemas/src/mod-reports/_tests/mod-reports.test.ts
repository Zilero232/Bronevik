import { describe, expect, it } from 'vitest';

import { MOD_REPORTS } from '../mod-reports.constants';
import { modProblemReportRequestSchema } from '../mod-reports.schemas';

const report = {
  manager_version: '0.3.0',
  modpack_version: '0.1.3',
  game_version: null,
  message: '',
  files: [{ name: 'logs/python.log', text: 'Traceback' }]
};

describe('modProblemReportRequestSchema', () => {
  it('accepts a report with an empty message', () => {
    expect(modProblemReportRequestSchema.safeParse(report).success).toBe(true);
  });

  it('refuses a report without files and one with too many', () => {
    const files = Array.from({ length: MOD_REPORTS.maxFiles + 1 }, (_, index) => ({ name: `${index}.log`, text: '' }));

    expect(modProblemReportRequestSchema.safeParse({ ...report, files: [] }).success).toBe(false);
    expect(modProblemReportRequestSchema.safeParse({ ...report, files }).success).toBe(false);
  });

  it('refuses a file name with characters outside the allowed set', () => {
    for (const name of ['..\\python.log', 'python log', '']) {
      expect(modProblemReportRequestSchema.safeParse({ ...report, files: [{ name, text: '' }] }).success).toBe(false);
    }
  });

  it('refuses a message past the limit', () => {
    expect(modProblemReportRequestSchema.safeParse({ ...report, message: 'x'.repeat(MOD_REPORTS.messageMaxLength + 1) }).success).toBe(false);
  });
});
