import { describe, expect, it } from 'vitest';

import { stableUuid } from '../stable-uuid';

describe('stableUuid', () => {
  it('maps the same key to the same UUID', () => {
    expect(stableUuid('mark:1:2:3')).toBe(stableUuid('mark:1:2:3'));
  });

  it('maps different keys to different UUIDs', () => {
    expect(stableUuid('mark:1:2:3')).not.toBe(stableUuid('mark:1:2:2'));
  });

  it('produces an RFC 4122 shaped UUID', () => {
    expect(stableUuid('any')).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});
