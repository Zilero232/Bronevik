import { describe, expect, it } from 'vitest';

import { updateOfferSchema } from '../coaching.schemas';

describe('updateOfferSchema', () => {
  it('leaves withReplay unset when the edit only deactivates the offer', () => {
    expect(updateOfferSchema.parse({ isActive: false })).toEqual({ isActive: false });
  });
});
