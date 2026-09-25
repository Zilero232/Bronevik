import type { InterpolateInput, OnSegmentInput } from './interpolation.types';

const onSegment = ({ from: [x0, y0], to: [x1, y1], x }: OnSegmentInput): number => (x1 === x0 ? y1 : y0 + ((x - x0) / (x1 - x0)) * (y1 - y0));

export const interpolate = ({ points, x, extrapolate = false }: InterpolateInput): number => {
  const index = points.findIndex(([pointX], position) => position > 0 && x <= pointX);

  if (index > 0) {
    return onSegment({ from: points[index - 1] ?? [0, 0], to: points[index] ?? [0, 0], x });
  }

  const last = points.at(-1) ?? [0, 0];
  const previous = points.at(-2) ?? last;

  return extrapolate ? onSegment({ from: previous, to: last, x }) : last[1];
};
