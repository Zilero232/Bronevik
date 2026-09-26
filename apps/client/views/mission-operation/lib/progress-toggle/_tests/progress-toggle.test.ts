import { describe, expect, it } from 'vitest';

import { progressToggle } from '../progress-toggle';

describe('progressToggle', () => {
  it('marks a mission done when honors are checked', () => {
    expect(progressToggle({ current: { done: false, honors: false }, field: 'honors', checked: true })).toEqual({ done: true, honors: true });
  });

  it('drops honors when the mission is unchecked', () => {
    expect(progressToggle({ current: { done: true, honors: true }, field: 'done', checked: false })).toEqual({ done: false, honors: false });
  });

  it('keeps the mission done when only honors are removed', () => {
    expect(progressToggle({ current: { done: true, honors: true }, field: 'honors', checked: false })).toEqual({ done: true, honors: false });
  });
});
