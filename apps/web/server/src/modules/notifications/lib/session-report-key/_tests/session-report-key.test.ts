import { describe, expect, it } from 'vitest';

import { sessionReportKey } from '../session-report-key';

describe('sessionReportKey', () => {
  it('keys the session report by the session id', () => {
    expect(sessionReportKey('3f0a')).toBe('session-3f0a');
  });
});
