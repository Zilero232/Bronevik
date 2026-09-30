import { describe, expect, it } from 'vitest';

import { fitScale } from '../fit-scale';

describe(fitScale, () => {
  it('keeps content that fits at its own size', () => {
    expect(fitScale({ frame: { width: 400, height: 100 }, content: { width: 200, height: 40 } })).toBe(1);
  });

  it('shrinks wide content to the frame width', () => {
    expect(fitScale({ frame: { width: 400, height: 100 }, content: { width: 800, height: 40 } })).toBe(0.5);
  });

  it('shrinks tall content to the frame height', () => {
    expect(fitScale({ frame: { width: 400, height: 100 }, content: { width: 200, height: 400 } })).toBe(0.25);
  });

  it('leaves content alone until it is measured', () => {
    expect(fitScale({ frame: { width: 400, height: 100 }, content: { width: 0, height: 0 } })).toBe(1);
  });
});
