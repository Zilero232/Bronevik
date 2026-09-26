import { heatLevel } from '@/shared/lib';

import type { HeatGrid, HeatGridInput } from './heat-grid.types';

export const heatGrid = ({ grid, levels }: HeatGridInput): HeatGrid => {
  const values = grid.flat();
  const max = Math.max(0, ...values);

  return {
    max,
    total: values.reduce((sum, value) => sum + value, 0),
    rows: grid.map((hours, day) => ({
      day,
      cells: hours.map((value, hour) => ({ hour, value, level: heatLevel({ value, max, levels }) }))
    }))
  };
};
