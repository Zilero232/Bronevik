import { describe, expect, it } from 'vitest';

import { hitPanel, pointerPoint } from '../hit-panel';

const target = (id: string, left: number, movable = true, pointer = false) => ({
  id,
  rect: { left, top: 10, width: 100, height: 40 },
  button: false,
  movable,
  pointer
});

describe(hitPanel, () => {
  it('finds the topmost movable panel under the pointer', () => {
    const targets = [target('under', 0), target('over', 50)];

    expect(hitPanel({ targets, point: { x: 60, y: 20 } })?.id).toBe('over');
    expect(hitPanel({ targets, point: { x: 20, y: 20 } })?.id).toBe('under');
  });

  it('misses outside every panel and skips panels that may not move', () => {
    expect(hitPanel({ targets: [target('a', 0)], point: { x: 300, y: 20 } })).toBeNull();
    expect(hitPanel({ targets: [target('fixed', 0, false)], point: { x: 20, y: 20 } })).toBeNull();
  });

  it('counts a fixed panel with tooltips only when the pointer is asked for', () => {
    const targets = [target('tips', 0, false, true)];

    expect(hitPanel({ targets, point: { x: 20, y: 20 } })).toBeNull();
    expect(hitPanel({ targets, point: { x: 20, y: 20 }, pointer: true })?.id).toBe('tips');
  });
});

describe(pointerPoint, () => {
  it('turns client pixels into design pixels at the interface scale', () => {
    expect(pointerPoint({ clientX: 300, clientY: 150, scale: 1.5 })).toEqual({ x: 200, y: 100 });
    expect(pointerPoint({ clientX: 300, clientY: 150, scale: 0 })).toEqual({ x: 300, y: 150 });
  });
});
