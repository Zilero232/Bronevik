import { describe, expect, it } from 'vitest';

import { selectRelease } from '../select-release';
import { INDEX } from './fixtures';

describe('selectRelease', () => {
  it('picks the newest release that supports the client, comparing versions semantically', () => {
    const latest = selectRelease({ index: INDEX, game: '1.46.0.0' });

    expect(latest.status).toBe('compatible');
    expect(latest.release?.version).toBe('0.10.0');
  });

  it('keeps an older client on the newest release that still supports it', () => {
    expect(selectRelease({ index: INDEX, game: '1.45.1.0' }).release?.version).toBe('0.2.0');
  });

  it('asks the manager to wait when no release supports the client yet', () => {
    expect(selectRelease({ index: INDEX, game: '1.47.0.0' })).toEqual({ game: '1.47.0.0', status: 'waiting', release: null });
  });
});
