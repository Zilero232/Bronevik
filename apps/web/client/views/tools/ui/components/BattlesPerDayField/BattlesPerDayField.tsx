'use client';

import { useFormatter } from 'next-intl';

import { RangeSlider } from '@/ui-kit';

import type { BattlesPerDayFieldProps } from './BattlesPerDayField.types';

export const BattlesPerDayField = (props: BattlesPerDayFieldProps) => {
  const format = useFormatter();

  return <RangeSlider {...props} valueLabel={format.number(props.value)} />;
};
