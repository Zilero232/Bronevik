import { describe, expect, it } from 'vitest';

import { findButtonModel } from '../find-model';

const open = (): void => {};

describe('findButtonModel', () => {
  it('finds the marked model among the page sub views', () => {
    const model = { otmetkiButton: 'otmetki', open };

    expect(findButtonModel({ model: { other: 1 }, subViews: { a: { model: { open } }, b: { model } } })).toBe(model);
    expect(findButtonModel({ model })).toBe(model);
  });

  it('ignores models without the marker or the command', () => {
    expect(findButtonModel({ model: { open } })).toBeNull();
    expect(findButtonModel({ model: { otmetkiButton: 'otmetki' } })).toBeNull();
    expect(findButtonModel(null)).toBeNull();
  });
});
