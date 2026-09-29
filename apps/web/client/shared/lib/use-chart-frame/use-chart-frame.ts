'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useId } from 'react';

import { useChartFormat } from '../use-chart-format';

export const useChartFrame = (formatValue?: (value: number) => string) => {
  const tableId = useId();
  const [isTable, toggleTable] = useBoolean(false);
  const format = useChartFormat(formatValue);

  const onTableToggle = () => toggleTable();

  return { tableId, isTable, format, onTableToggle };
};
