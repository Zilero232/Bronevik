export type BoardPoint = {
  x: number;
  y: number;
};

export type BoardBox = BoardPoint & {
  width: number;
  height: number;
};

export type BoardCircle = BoardPoint & {
  radius: number;
};

export type FitScaleInput = {
  width: number;
  size: number;
};

export type PointsWithPoint = {
  points: readonly number[];
  point: BoardPoint;
};

export type TranslatePointsInput = {
  points: readonly number[];
  dx: number;
  dy: number;
};
