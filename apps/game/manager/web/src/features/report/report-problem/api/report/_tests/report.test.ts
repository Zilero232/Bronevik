import preview from '@contract/report-preview.json';
import receipt from '@contract/report-receipt.json';
import { describe, expect, it } from 'vitest';

import { reportPreviewSchema, reportReceiptSchema } from '@/features/report/report-problem';

describe('reportPreviewSchema', () => {
  it('parses exactly what the report would send, already redacted', () => {
    const parsed = reportPreviewSchema.parse(preview);

    expect(parsed.items.map((item) => item.part)).toEqual(['environment', 'python_log']);
    expect(parsed.items[1]?.text).toContain('<user>');
  });
});

describe('reportReceiptSchema', () => {
  it('parses the number the server gave the report', () => {
    expect(reportReceiptSchema.parse(receipt).expiresAt).toBe(receipt.expiresAt);
  });
});
