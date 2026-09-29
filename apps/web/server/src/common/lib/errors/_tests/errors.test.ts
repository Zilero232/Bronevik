import { describe, expect, it } from 'vitest';

import { errorMessage, isMissingFileError } from '../errors';

describe('errorMessage', () => {
  it('reads the message of an Error', () => {
    expect(errorMessage(new TypeError('broken'))).toBe('broken');
  });

  it('stringifies anything that is not an Error', () => {
    expect(errorMessage('plain')).toBe('plain');
    expect(errorMessage(42)).toBe('42');
    expect(errorMessage(null)).toBe('null');
  });
});

describe('isMissingFileError', () => {
  it('recognises a missing file', () => {
    expect(isMissingFileError(Object.assign(new Error('gone'), { code: 'ENOENT' }))).toBe(true);
  });

  it('rejects other file system errors and non-errors', () => {
    expect(isMissingFileError(Object.assign(new Error('denied'), { code: 'EACCES' }))).toBe(false);
    expect(isMissingFileError(new Error('plain'))).toBe(false);
    expect(isMissingFileError({ code: 'ENOENT' })).toBe(false);
  });
});
