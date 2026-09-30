import { describe, expect, it } from 'vitest';

import { gestureAt } from '..';

const rect = (left: number, top: number, width: number, height: number) => ({ left, top, width, height });

describe(gestureAt, () => {
  const targets = [
    { kind: 'corner' as const, rect: rect(980, 680, 20, 20) },
    { kind: 'right' as const, rect: rect(994, 0, 6, 700) },
    { kind: 'move' as const, rect: rect(0, 0, 240, 60) },
    { kind: 'bottom' as const, rect: null }
  ];

  it('finds the handle under the pointer, the grip before the edge it overlaps', () => {
    expect(gestureAt({ targets, x: 20, y: 30 })).toBe('move');
    expect(gestureAt({ targets, x: 996, y: 690 })).toBe('corner');
    expect(gestureAt({ targets, x: 996, y: 300 })).toBe('right');
  });

  it('starts nothing over the content or a handle that is not drawn', () => {
    expect(gestureAt({ targets, x: 500, y: 300 })).toBeNull();
    expect(gestureAt({ targets: [{ kind: 'move', rect: rect(0, 0, 0, 0) }], x: 0, y: 0 })).toBeNull();
  });
});
