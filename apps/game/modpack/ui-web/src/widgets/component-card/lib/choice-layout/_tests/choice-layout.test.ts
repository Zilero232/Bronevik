import { describe, expect, it } from 'vitest';

import { CHOICE_LAYOUT } from '../../../config';
import { choiceLayout } from '../choice-layout';

const choice = (label: string) => ({ value: label, label });

describe(choiceLayout, () => {
  it('keeps a few short choices on one segmented row', () => {
    expect(choiceLayout(['Alt', 'Ctrl', 'Shift'].map(choice))).toBe('segmented');
  });

  it('stacks many or long choices into a list', () => {
    expect(choiceLayout(Array.from({ length: CHOICE_LAYOUT.maxSegments + 1 }, (_, index) => choice(String(index))))).toBe('list');
    expect(choiceLayout([choice('x'.repeat(CHOICE_LAYOUT.maxSegmentChars)), choice('y')])).toBe('list');
  });
});
