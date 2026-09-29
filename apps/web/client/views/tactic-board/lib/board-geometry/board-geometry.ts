import { clamp, round } from 'remeda';

import type { TacticStroke } from '@/entities/tactic/board';

import type { BoardBox, BoardCircle, BoardPoint, FitScaleInput, PointsWithPoint, TranslatePointsInput } from './board-geometry.types';

import { BOARD, BOARD_LIMITS } from '../../config';

const onBoard = (value: number) => round(clamp(value, { min: 0, max: BOARD.size }), BOARD.precisionDigits);

export const fitScale = ({ width, size }: FitScaleInput): number => (width > 0 && size > 0 ? width / size : 0);

export const clampPoint = ({ x, y }: BoardPoint): BoardPoint => ({ x: onBoard(x), y: onBoard(y) });

export const appendPenPoint = ({ points, point }: PointsWithPoint): readonly number[] => {
  const next = clampPoint(point);
  const lastX = points.at(-2);
  const lastY = points.at(-1);

  if (points.length + 2 > BOARD_LIMITS.points) {
    return points;
  }

  if (lastX !== undefined && lastY !== undefined && Math.hypot(next.x - lastX, next.y - lastY) < BOARD.minPointDistance) {
    return points;
  }

  return [...points, next.x, next.y];
};

export const dragShapePoints = ({ points, point }: PointsWithPoint): number[] => {
  const next = clampPoint(point);

  return [points[0] ?? next.x, points[1] ?? next.y, next.x, next.y];
};

export const rectBox = (points: readonly number[]): BoardBox => {
  const [x1 = 0, y1 = 0, x2 = x1, y2 = y1] = points;

  return { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) };
};

export const circleOf = (points: readonly number[]): BoardCircle => {
  const [x = 0, y = 0, ex = x, ey = y] = points;

  return { x, y, radius: round(Math.hypot(ex - x, ey - y), BOARD.precisionDigits) };
};

export const isDrawnStroke = ({ tool, points, text }: TacticStroke): boolean => {
  if (tool === 'text') {
    return (text ?? '').trim().length > 0 && points.length >= 2;
  }

  if (tool === 'pen') {
    return points.length >= 4;
  }

  const [x1 = 0, y1 = 0, x2 = x1, y2 = y1] = points;

  return Math.hypot(x2 - x1, y2 - y1) >= BOARD.minShapeSize;
};

export const translatePoints = ({ points, dx, dy }: TranslatePointsInput): number[] =>
  points.map((value, index) => onBoard(value + (index % 2 === 0 ? dx : dy)));
