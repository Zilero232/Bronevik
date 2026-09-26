export type ChartHoverState = {
  index: number;
  left: number;
  top: number;
};

export type UseChartHoverInput = {
  count: number;
  toIndex: (x: number) => number;
  toPosition: (index: number) => { left: number; top: number };
};
