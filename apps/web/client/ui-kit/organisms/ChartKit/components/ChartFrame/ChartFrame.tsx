'use client';

import { ParentSize } from '@visx/responsive';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { CHART, useChartFrame } from '@/shared/lib';

import type { ChartFrameProps } from './ChartFrame.types';

import { ChartDataTable } from '../ChartDataTable';
import { CHART_FRAME } from './ChartFrame.constants';

import s from '../../ChartKit.module.scss';

export const ChartFrame = ({
  height = CHART.defaultHeight,
  ariaLabel,
  className,
  labels,
  series,
  hasTableToggle = false,
  formatValue,
  children
}: ChartFrameProps) => {
  const t = useTranslations('common.chart');
  const { tableId, isTable, format, onTableToggle } = useChartFrame(formatValue);

  return (
    <figure className={clsx(s.figure, className)}>
      <div aria-describedby={tableId} aria-label={ariaLabel} className={s.frame} hidden={isTable} role='img' style={{ height }}>
        <ParentSize debounceTime={CHART_FRAME.resizeDebounceMs}>
          {({ width }) => width > 0 && children({ width, height, labels, series, formatValue: format })}
        </ParentSize>
      </div>
      <ChartDataTable caption={ariaLabel} formatValue={format} id={tableId} isVisible={isTable} labels={labels} series={series} />
      {hasTableToggle && (
        <button aria-controls={tableId} aria-expanded={isTable} className={s.tableToggle} type='button' onClick={onTableToggle}>
          {isTable ? t('showChart') : t('showTable')}
        </button>
      )}
    </figure>
  );
};
