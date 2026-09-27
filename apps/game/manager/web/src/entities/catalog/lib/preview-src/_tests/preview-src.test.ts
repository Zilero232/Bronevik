import { describe, expect, it } from 'vitest';

import { previewPath } from '../preview-src';

describe('previewPath', () => {
  it('joins the manifest-relative image onto the previews folder', () => {
    expect(previewPath({ previewsDir: 'C:\\Program Files\\Three Marks\\resources\\', image: 'previews/core.png' })).toBe(
      'C:\\Program Files\\Three Marks\\resources\\previews\\core.png'
    );
  });

  it('has no preview without a folder or an image', () => {
    expect(previewPath({ previewsDir: null, image: 'previews/core.png' })).toBeNull();
    expect(previewPath({ previewsDir: 'C:\\x', image: null })).toBeNull();
  });

  it('refuses an image path that climbs out of the folder', () => {
    expect(previewPath({ previewsDir: 'C:\\x', image: '../secret.png' })).toBeNull();
  });
});
