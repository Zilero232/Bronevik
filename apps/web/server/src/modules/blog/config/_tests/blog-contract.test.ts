import { BLOG_CONTRACT } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { BlogCategory, BlogPostStatus } from '../../../../../generated';
import { BLOG_IMAGES } from '../image.constants';

describe('blog contract', () => {
  it('matches the database enums', () => {
    expect(Object.values(BlogCategory)).toEqual(BLOG_CONTRACT.categories);
    expect(Object.values(BlogPostStatus)).toEqual(BLOG_CONTRACT.statuses);
  });

  it('accepts exactly the stored image types', () => {
    expect(Object.keys(BLOG_IMAGES.types)).toEqual(BLOG_CONTRACT.imageExtensions);
  });
});
