import { describe, expect, it } from 'vitest';

import { setFileName } from '../set-file-name';

describe('setFileName', () => {
  it('keeps a plain name', () => {
    expect(setFileName({ name: 'Турнир', extension: 'tmset' })).toBe('Турнир.tmset');
  });

  it('replaces what a Windows file name cannot hold', () => {
    expect(setFileName({ name: 'Стрим: 1/2 <XVM>?', extension: 'tmset' })).toBe('Стрим_ 1_2 _XVM__.tmset');
    expect(setFileName({ name: 'a\tb', extension: 'tmset' })).toBe('a_b.tmset');
    expect(setFileName({ name: 'C:\\Windows\\x', extension: 'tmset' })).toBe('C__Windows_x.tmset');
  });

  it('drops trailing dots and spaces and falls back for an empty name', () => {
    expect(setFileName({ name: 'Набор. . ', extension: 'json' })).toBe('Набор.json');
    expect(setFileName({ name: ' ... ', extension: 'tmset' })).toBe('set.tmset');
  });
});
