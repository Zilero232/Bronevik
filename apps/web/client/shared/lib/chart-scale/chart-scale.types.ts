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

export type SparklineLayoutInput = {
  data: readonly number[];
  width: number;
  height: number;
  pad: number;
};

export type ClampIndexInput = {
  value: number;
  count: number;
};
