import { describe, expect, it } from 'vitest';

import { isReplayPending } from '../replay-state';

describe('isReplayPending', () => {
  it('keeps polling while the replay is queued or being parsed', () => {
    expect(isReplayPending('uploaded')).toBe(true);
    expect(isReplayPending('parsing')).toBe(true);
  });

  it('stops once parsing has finished either way or nothing is loaded yet', () => {
    expect(isReplayPending('parsed')).toBe(false);
    expect(isReplayPending('failed')).toBe(false);
    expect(isReplayPending(undefined)).toBe(false);
  });
});
