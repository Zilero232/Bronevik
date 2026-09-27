import { describe, expect, it } from 'vitest';

import { slugify } from '../slug';

describe('slugify', () => {
  it('turns a game tag into a lowercase dashed slug', () => {
    expect(slugify('R01_IS')).toBe('r01-is');
  });

  it('keeps camel-cased tags in one word', () => {
    expect(slugify('Pz_Kpfw_VIB_Tiger_II')).toBe(slugify('pz_kpfw_vib_tiger_ii'));
  });

  it('drops leading and trailing separators', () => {
    expect(slugify('_01_karelia_')).toBe('01-karelia');
  });

  it('returns an empty string for an input without letters or digits', () => {
    expect(slugify('__')).toBe('');
  });
});
