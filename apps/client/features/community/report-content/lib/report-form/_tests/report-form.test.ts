import { describe, expect, it } from 'vitest';

import { toCreateReport } from '../report-form';
import { reportFormSchema } from '../report-form.schemas';

describe('reportFormSchema', () => {
  it('trims the details', () => {
    expect(reportFormSchema.parse({ reason: 'spam', details: '  bot links  ' }).details).toBe('bot links');
  });

  it('rejects a reason the server does not know', () => {
    expect(reportFormSchema.safeParse({ reason: 'boring', details: '' }).success).toBe(false);
  });
});

describe('toCreateReport', () => {
  it('omits empty details', () => {
    expect(toCreateReport({ values: { reason: 'abuse', details: '' }, targetType: 'guide', targetId: 'g1' })).not.toHaveProperty('details');
  });

  it('keeps the target and the written details', () => {
    expect(toCreateReport({ values: { reason: 'other', details: 'copied' }, targetType: 'comment', targetId: 'c1' })).toEqual({
      targetType: 'comment',
      targetId: 'c1',
      reason: 'other',
      details: 'copied'
    });
  });
});
