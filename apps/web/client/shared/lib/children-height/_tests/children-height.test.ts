import { describe, expect, it } from 'vitest';

import { childrenHeight } from '../children-height';

const box = ({ top, height }: { top: number; height: number }) => {
  const element = document.createElement('div');

  element.getBoundingClientRect = () => ({ top, bottom: top + height, height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) });

  return element;
};

describe('childrenHeight', () => {
  it('spans from the highest child top to the lowest child bottom', () => {
    const parent = document.createElement('div');

    parent.append(box({ top: 100, height: 40 }), box({ top: 150, height: 60 }));

    expect(childrenHeight(parent)).toBe(110);
  });

  it('ignores hidden children and reports nothing for an empty node', () => {
    const parent = document.createElement('div');

    expect(childrenHeight(parent)).toBe(0);

    parent.append(box({ top: 0, height: 0 }));

    expect(childrenHeight(parent)).toBe(0);
  });
});
