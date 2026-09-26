import { describe, expect, it } from 'vitest';

import type { TacticStroke } from '@/shared/api/tactics';

import { BOARD, BOARD_LIMITS } from '../../../config';
import { appendPenPoint, circleOf, clampPoint, dragShapePoints, fitScale, isDrawnStroke, rectBox, translatePoints } from '../board-geometry';

const stroke = (patch: Partial<TacticStroke>): TacticStroke => ({ id: 's', tool: 'line', color: '#fff', width: 2, points: [], ...patch });

describe('fitScale', () => {
  it('maps the logical board onto the container width', () => {
    expect(fitScale({ width: 500, size: BOARD.size })).toBe(0.5);
  });

  it('returns zero before the container has been measured', () => {
    expect(fitScale({ width: 0, size: BOARD.size })).toBe(0);
  });
});

describe('clampPoint', () => {
  it('keeps points inside the board', () => {
    expect(clampPoint({ x: -20, y: BOARD.size + 40 })).toEqual({ x: 0, y: BOARD.size });
  });

  it('rounds to one decimal so the document stays small', () => {
    expect(clampPoint({ x: 10.1234, y: 20.987 })).toEqual({ x: 10.1, y: 21 });
  });
});

describe('appendPenPoint', () => {
  it('adds a point far enough from the last one', () => {
    expect(appendPenPoint({ points: [0, 0], point: { x: 10, y: 0 } })).toEqual([0, 0, 10, 0]);
  });

  it('skips jitter closer than the minimum distance', () => {
    const points = [0, 0];

    expect(appendPenPoint({ points, point: { x: 1, y: 1 } })).toBe(points);
  });

  it('stops growing at the server point limit', () => {
    const points = Array.from({ length: BOARD_LIMITS.points }, (_, index) => index);

    expect(appendPenPoint({ points, point: { x: 999, y: 999 } })).toBe(points);
  });
});

describe('dragShapePoints', () => {
  it('keeps the anchor and moves the end point', () => {
    expect(dragShapePoints({ points: [5, 6, 7, 8], point: { x: 50, y: 60 } })).toEqual([5, 6, 50, 60]);
  });
});

describe('rectBox', () => {
  it('normalizes a rectangle dragged up and to the left', () => {
    expect(rectBox([100, 100, 40, 70])).toEqual({ x: 40, y: 70, width: 60, height: 30 });
  });
});

describe('circleOf', () => {
  it('uses the drag distance as the radius', () => {
    expect(circleOf([0, 0, 30, 40])).toEqual({ x: 0, y: 0, radius: 50 });
  });
});

describe('isDrawnStroke', () => {
  it('drops a click without a drag', () => {
    expect(isDrawnStroke(stroke({ points: [10, 10, 11, 10] }))).toBe(false);
  });

  it('keeps a shape dragged past the minimum size', () => {
    expect(isDrawnStroke(stroke({ points: [10, 10, 60, 10] }))).toBe(true);
  });

  it('needs at least two points for a pen stroke', () => {
    expect(isDrawnStroke(stroke({ tool: 'pen', points: [10, 10] }))).toBe(false);
  });

  it('drops blank text', () => {
    expect(isDrawnStroke(stroke({ tool: 'text', points: [10, 10], text: '   ' }))).toBe(false);
  });
});

describe('translatePoints', () => {
  it('moves x and y coordinates independently', () => {
    expect(translatePoints({ points: [10, 20, 30, 40], dx: 5, dy: -5 })).toEqual([15, 15, 35, 35]);
  });

  it('does not push a stroke off the board', () => {
    expect(translatePoints({ points: [10, 10], dx: -50, dy: 0 })).toEqual([0, 10]);
  });
});
