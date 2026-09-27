'use client';

import { useFormatter } from 'next-intl';

export const useChartFormat = (formatValue?: (value: number) => string) => {
  const format = useFormatter();

  return formatValue ?? ((value: number) => format.number(value, 'compact'));
};
