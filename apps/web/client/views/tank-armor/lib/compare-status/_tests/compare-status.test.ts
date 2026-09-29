import { describe, expect, it } from 'vitest';

import { NotFoundError, PlusRequiredError } from '@/shared/api/source';

import { compareStatus } from '../compare-status';

describe('compareStatus', () => {
  it('is ready once the second model is in, whatever failed before', () => {
    expect(compareStatus({ hasData: true, error: new Error('stale') })).toBe('ready');
  });

  it('keeps loading while there is neither data nor an error', () => {
    expect(compareStatus({ hasData: false, error: null })).toBe('loading');
  });

  it('tells a spent monthly quota apart from a missing model and a failure', () => {
    const limited = new PlusRequiredError({ code: 'SUBSCRIPTION_REQUIRED', details: { feature: 'armor3d' }, message: 'limit' });

    expect(compareStatus({ hasData: false, error: limited })).toBe('limited');
    expect(compareStatus({ hasData: false, error: new NotFoundError() })).toBe('missing');
    expect(compareStatus({ hasData: false, error: new Error('boom') })).toBe('error');
  });
});
