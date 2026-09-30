import { describe, expect, it } from 'vitest';

import { CHOICE_LAYOUT } from '../../../config';
import { choiceLayout } from '../choice-layout';

const choice = (label: string) => ({ value: label, label });

describe(choiceLayout, () => {
  it('keeps a few short choices on one segmented row', () => {
    expect(choiceLayout(['Alt', 'Ctrl', 'Shift'].map(choice))).toBe('segmented');
  });

  it('stacks more choices than the row holds into a list', () => {
    const many = Array.from({ length: CHOICE_LAYOUT.maxSegments + 1 }, (_, index) => choice(String(index)));

    expect(choiceLayout(many)).toBe('list');
  });

  it('stacks choices whose labels run longer than the row into a list', () => {
    const long = [choice('x'.repeat(CHOICE_LAYOUT.maxSegmentChars)), choice('y')];

    expect(choiceLayout(long)).toBe('list');
  });
});
