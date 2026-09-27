import type { ProgressTone } from '../../atoms';

export type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  tone?: ProgressTone;
  withArea?: boolean;
  label?: string;
  className?: string;
};
