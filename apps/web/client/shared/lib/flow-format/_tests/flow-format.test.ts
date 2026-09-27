import { describe, expect, it } from 'vitest';

import { flowFormat } from '../flow-format';

describe('flowFormat', () => {
  it('keeps the notations number-flow can animate', () => {
    expect(flowFormat({ notation: 'compact', maximumFractionDigits: 1 })).toEqual({ notation: 'compact', maximumFractionDigits: 1 });
  });

  it('drops the notations number-flow cannot render', () => {
    expect(flowFormat({ notation: 'scientific', maximumFractionDigits: 2 })).toEqual({ maximumFractionDigits: 2 });
  });

  it('passes a missing format through', () => {
    expect(flowFormat(undefined)).toBeUndefined();
  });
});
