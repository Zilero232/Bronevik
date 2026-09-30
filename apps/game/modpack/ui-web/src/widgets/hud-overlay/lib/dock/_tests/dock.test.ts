import { describe, expect, it } from 'vitest';

import { stackDocks } from '../dock';

const screen = { width: 1920, height: 1080 };
const rect = (left: number, top: number, height: number, width = 260) => ({ left, top, width, height });
const item = (
  id: string,
  order: number,
  box: ReturnType<typeof rect>,
  options: { upward?: boolean; align?: 'center' | 'left' | 'right'; group?: string; reserve?: number } = {}
) => ({
  id,
  dock: { group: options.group ?? 'left', order, reserve: options.reserve },
  upward: options.upward ?? false,
  align: options.align ?? ('left' as const),
  rect: box
});

describe(stackDocks, () => {
  it('stacks a top-anchored column downwards in order, whatever order the panels come in', () => {
    const placed = stackDocks({
      screen,
      gap: 6,
      reserve: 190,
      ceiling: 80,
      items: [item('b', 1, rect(16, 440, 60)), item('a', 0, rect(16, 440, 100)), item('c', 2, rect(16, 440, 40))]
    });

    expect([placed.get('a')?.top, placed.get('b')?.top, placed.get('c')?.top]).toEqual([440, 546, 612]);
  });

  it('stacks a bottom-anchored column upwards', () => {
    const placed = stackDocks({
      screen,
      gap: 6,
      reserve: 0,
      ceiling: 80,
      items: [item('log', 0, rect(232, 924, 150), { upward: true }), item('marks', 1, rect(232, 1014, 60), { upward: true })]
    });

    expect(placed.get('marks')?.top).toBe(924 - 6 - 60);
  });

  it('moves a column that does not fit up first, never above the ceiling', () => {
    const placed = stackDocks({
      screen,
      gap: 6,
      reserve: 190,
      ceiling: 80,
      items: [item('a', 0, rect(16, 440, 300)), item('b', 1, rect(16, 440, 200, 240))]
    });

    expect(placed.get('a')?.top).toBe(890 - 506);
    expect(placed.get('b')).toEqual({ left: 16, top: 890 - 200, width: 240, height: 200 });
  });

  it('starts a new column towards the middle when even the lifted column crosses the reserved bottom strip', () => {
    const left = stackDocks({
      screen,
      gap: 6,
      reserve: 190,
      ceiling: 400,
      items: [item('a', 0, rect(16, 440, 300)), item('b', 1, rect(16, 440, 200, 240))]
    });

    expect(left.get('b')).toEqual({ left: 16 + 260 + 6, top: 400, width: 240, height: 200 });

    const right = stackDocks({
      screen,
      gap: 6,
      reserve: 190,
      ceiling: 570,
      items: [item('a', 0, rect(1644, 570, 300), { align: 'right' }), item('b', 1, rect(1664, 570, 100, 240), { align: 'right' })]
    });

    expect(right.get('b')).toEqual({ left: 1644 - 6 - 240, top: 570, width: 240, height: 100 });
  });

  it('lines a right-anchored column up on its right edge and leaves a moved panel alone', () => {
    const placed = stackDocks({
      screen,
      gap: 6,
      reserve: 190,
      ceiling: 80,
      items: [
        { id: 'moved', dock: null, upward: false, align: 'left' as const, rect: rect(100, 100, 50) },
        item('first', 0, rect(1644, 100, 60), { align: 'right', group: 'right' }),
        item('second', 1, rect(1684, 100, 60, 220), { align: 'right', group: 'right' })
      ]
    });

    expect(placed.get('moved')?.top).toBe(100);
    expect(placed.get('second')).toEqual({ left: 1684, top: 166, width: 220, height: 60 });
  });

  it('honours the reserve a group carries and keeps a centred column centred', () => {
    const placed = stackDocks({
      screen,
      gap: 6,
      reserve: 190,
      ceiling: 80,
      items: [
        item('a', 0, rect(830, 60, 80), { align: 'center', group: 'top', reserve: 700 }),
        item('b', 1, rect(850, 60, 60, 220), { align: 'center', group: 'top', reserve: 700 })
      ]
    });

    expect(placed.get('b')).toEqual({ left: 850, top: 146, width: 220, height: 60 });

    const kept = stackDocks({
      screen,
      gap: 6,
      reserve: 190,
      ceiling: 80,
      items: [item('a', 0, rect(8, 548, 100), { reserve: 360 }), item('b', 1, rect(8, 548, 100), { reserve: 360 })]
    });

    expect(kept.get('a')?.top).toBe(1080 - 360 - 206);
    expect(kept.get('b')).toEqual({ left: 8, top: 1080 - 360 - 100, width: 260, height: 100 });
  });

  it('never lifts a column into an undocked panel above it', () => {
    const placed = stackDocks({
      screen,
      gap: 6,
      reserve: 190,
      ceiling: 80,
      items: [
        { id: 'clock', dock: null, upward: false, align: 'right' as const, rect: rect(1644, 76, 150) },
        item('a', 0, rect(1644, 570, 350), { align: 'right' }),
        item('b', 1, rect(1644, 570, 350), { align: 'right' })
      ]
    });

    expect(placed.get('a')?.top).toBe(76 + 150 + 6);
  });

  it('keeps a column whose group forbids lifting at its anchor and wraps it instead', () => {
    const pinned = (id: string, order: number) => ({
      ...item(id, order, rect(8, 548, 120)),
      dock: { group: 'mid', order, reserve: 360, ceiling: 548 }
    });

    const placed = stackDocks({ screen, gap: 6, reserve: 190, ceiling: 80, items: [pinned('a', 0), pinned('b', 1)] });

    expect(placed.get('a')?.top).toBe(548);
    expect(placed.get('b')).toEqual({ left: 8 + 260 + 6, top: 548, width: 260, height: 120 });
  });

  it('ends a column that stops above the middle of the screen there and wraps the rest', () => {
    const centred = (id: string, order: number) => ({
      ...item(id, order, rect(830, 60, 100), { align: 'center' }),
      dock: { group: 'top', order, reserve: 700, ceiling: 60, stop_center: 240 }
    });

    const placed = stackDocks({ screen, gap: 6, reserve: 190, ceiling: 80, items: [centred('a', 0), centred('b', 1), centred('c', 2)] });

    expect(placed.get('b')?.top).toBe(166);
    expect(placed.get('c')).toEqual({ left: 830 + 260 + 6, top: 60, width: 260, height: 100 });
  });
});
