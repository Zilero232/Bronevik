import { describe, expect, it } from 'vitest';

import { webhookStatus } from '../webhook-status';

const DISABLED_AT = '2026-09-20T10:00:00.000Z';

describe('webhookStatus', () => {
  it('reports an active endpoint as active even if an old disable stamp lingers', () => {
    expect(webhookStatus({ isActive: true, disabledAt: null })).toBe('active');
    expect(webhookStatus({ isActive: true, disabledAt: DISABLED_AT })).toBe('active');
  });

  it('tells an owner pause apart from a shutdown after failed deliveries', () => {
    expect(webhookStatus({ isActive: false, disabledAt: null })).toBe('paused');
    expect(webhookStatus({ isActive: false, disabledAt: DISABLED_AT })).toBe('disabled');
  });
});
