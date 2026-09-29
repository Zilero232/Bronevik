import { describe, expect, it } from 'vitest';

import { escapeLike, insensitiveEquals } from '../like-pattern';

describe('escapeLike', () => {
  it('escapes every LIKE wildcard and the escape character itself', () => {
    expect(escapeLike('a_b%c\\')).toBe('a\\_b\\%c\\\\');
  });

  it('leaves a value without wildcards unchanged', () => {
    expect(escapeLike('Straik84')).toBe('Straik84');
  });
});

describe('insensitiveEquals', () => {
  it('matches the value literally, so an underscore in a nickname is not a wildcard', () => {
    expect(insensitiveEquals('Vasya_Pupkin')).toEqual({ equals: 'Vasya\\_Pupkin', mode: 'insensitive' });
  });
});
