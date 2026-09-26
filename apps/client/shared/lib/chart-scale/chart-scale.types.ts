export type ChartScaleSeries = {
  values: number[];
};

export type ChartLayoutInput = {
  width: number;
  height: number;
  labels: string[];
  series: ChartScaleSeries[];
  yDomain?: [number, number];
  includeZero?: boolean;
};

export type ClampIndexInput = {
  value: number;
  count: number;
};
