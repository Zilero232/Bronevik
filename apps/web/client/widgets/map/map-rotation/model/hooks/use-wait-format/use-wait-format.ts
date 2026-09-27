'use client';

import { useFormatter } from 'next-intl';

export const useWaitFormat = () => {
  const format = useFormatter();

  return (seconds: number) => format.number(seconds, { style: 'unit', unit: 'second', unitDisplay: 'short', maximumFractionDigits: 0 });
};
