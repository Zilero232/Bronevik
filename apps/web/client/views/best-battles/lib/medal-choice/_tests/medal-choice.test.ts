import { describe, expect, it } from 'vitest';

import { pickMedal } from '../medal-choice';

describe('pickMedal', () => {
  it('selects a medal when none was chosen', () => {
    expect(pickMedal({ current: null, next: ['warrior'] })).toBe('warrior');
  });

  it('switches to the newly added medal', () => {
    expect(pickMedal({ current: 'warrior', next: ['warrior', 'invader'] })).toBe('invader');
  });

  it('clears the choice when the chosen medal is toggled off', () => {
    expect(pickMedal({ current: 'warrior', next: [] })).toBeNull();
  });
});
