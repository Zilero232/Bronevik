import { describe, expect, it } from 'vitest';

import { decodeRouteParam } from '../route-param';

describe('decodeRouteParam', () => {
  it('decodes a percent-encoded segment', () => {
    expect(decodeRouteParam(encodeURIComponent('стример'))).toBe('стример');
  });

  it('is idempotent for an already decoded value', () => {
    expect(decodeRouteParam('стример')).toBe('стример');
    expect(decodeRouteParam('object-140')).toBe('object-140');
  });

  it('keeps a malformed sequence as is', () => {
    expect(decodeRouteParam('100%')).toBe('100%');
  });
});
