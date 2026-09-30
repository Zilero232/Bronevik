import { describe, expect, it } from 'vitest';

import { gameLabel, parseReleaseNotes } from '../release-notes';

describe('parseReleaseNotes', () => {
  it('splits the lead paragraph from the list items', () => {
    const notes = parseReleaseNotes('Panels moved.\n\n- First fix.\n- Second fix.');

    expect(notes).toEqual({ summary: ['Panels moved.'], items: ['First fix.', 'Second fix.'] });
  });

  it('drops the code marks of macros', () => {
    const notes = parseReleaseNotes('- Macros `{up}` and `{need_up}`.');

    expect(notes.items).toEqual(['Macros {up} and {need_up}.']);
  });

  it('returns nothing for a release without notes', () => {
    expect(parseReleaseNotes(null)).toEqual({ summary: [], items: [] });
  });
});

describe('gameLabel', () => {
  it('shows a wildcard pattern as its minor version', () => {
    expect(gameLabel('1.45.*')).toBe('1.45');
  });

  it('keeps an exact client version', () => {
    expect(gameLabel('1.46.0.0')).toBe('1.46.0.0');
  });
});
