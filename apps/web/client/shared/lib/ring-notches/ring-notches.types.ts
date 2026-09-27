export type RingNotchesInput = {
  size: number;
  thickness: number;
  percents: readonly number[];
  overshoot?: number;
};

export type RingNotch = {
  percent: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
