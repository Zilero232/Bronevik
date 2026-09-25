'use client';

import { useLocale } from 'next-intl';

export const useChartFormat = (formatValue?: (value: number) => string) => {
  const locale = useLocale();

  if (formatValue) {
    return formatValue;
  }

  const formatter = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 2 });

  return (value: number) => formatter.format(value);
};
