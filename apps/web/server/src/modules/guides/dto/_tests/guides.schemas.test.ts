import { describe, expect, it } from 'vitest';

import { updateGuideSchema } from '../guides.schemas';

describe('updateGuideSchema', () => {
  it('leaves the locale unset when the edit only changes the title', () => {
    expect(updateGuideSchema.parse({ title: 'A better title' })).toEqual({ title: 'A better title' });
  });
});
