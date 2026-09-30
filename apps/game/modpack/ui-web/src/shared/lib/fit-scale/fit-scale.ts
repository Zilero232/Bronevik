import type { FitScaleInput } from './fit-scale.types';

const ratio = (room: number, size: number): number => (size > 0 && room > 0 ? room / size : 1);

export const fitScale = ({ frame, content }: FitScaleInput): number =>
  Math.min(1, ratio(frame.width, content.width), ratio(frame.height, content.height));
