export type CurvePoint = readonly [x: number, y: number];

export type InterpolateInput = {
  points: readonly CurvePoint[];
  x: number;
  extrapolate?: boolean;
};

export type OnSegmentInput = {
  from: CurvePoint;
  to: CurvePoint;
  x: number;
};
