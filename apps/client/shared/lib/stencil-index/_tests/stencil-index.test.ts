import { describe, expect, it } from 'vitest';

import { stencilIndex } from '../stencil-index';

describe('stencilIndex', () => {
  it('drops the leading comment slashes of a section index', () => {
    expect(stencilIndex('// 03')).toBe('03');
  });

  it('keeps a word index as it is', () => {
    expect(stencilIndex('// SYS')).toBe('SYS');
  });

  it('leaves an index without slashes untouched', () => {
    expect(stencilIndex('07')).toBe('07');
  });

  it('keeps slashes that are part of the index itself', () => {
    expect(stencilIndex('// 1/2')).toBe('1/2');
  });
});
