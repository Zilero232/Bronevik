import { describe, expect, it } from 'vitest';

import { PREVIEW } from '../../../config';
import { previewLook } from '../preview-look';

describe('previewLook', () => {
  it('gives a known category its own icon and colour', () => {
    expect(previewLook('battle')).toBe(PREVIEW.categories.battle);
  });

  it('falls back for an unknown or inherited category name', () => {
    expect(previewLook('something_new')).toBe(PREVIEW.fallback);
    expect(previewLook('toString')).toBe(PREVIEW.fallback);
  });
});
