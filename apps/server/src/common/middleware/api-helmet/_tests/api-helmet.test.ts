import { describe, expect, it } from 'vitest';

import { isDocumentationPath } from '../api-helmet';
import { API_HELMET } from '../api-helmet.constants';

describe('isDocumentationPath', () => {
  it.each(API_HELMET.documentationPaths)('relaxes the policy for the %s pages and everything under them', (prefix) => {
    expect(isDocumentationPath(prefix)).toBe(true);
    expect(isDocumentationPath(`${prefix}/asset.js`)).toBe(true);
  });

  it('keeps the strict policy for API routes that only share a prefix', () => {
    expect(isDocumentationPath('/docsearch')).toBe(false);
    expect(isDocumentationPath('/v1/players')).toBe(false);
    expect(isDocumentationPath('/admin/moderation')).toBe(false);
  });
});
