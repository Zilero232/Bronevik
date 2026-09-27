'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { ParentSize } from '@visx/responsive';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import type { ChartFrameProps } from './ChartFrame.types';

import { ChartDataTable } from '../ChartDataTable';

import s from '../../ChartKit.module.scss';

export const ChartFrame = ({ height, ariaLabel, className, labels, series, hasTableToggle = false, formatValue, children }: ChartFrameProps) => {
  const t = useTranslations('common.chart');
  const tableId = useId();
  const [isTable, toggleTable] = useBoolean(false);

  return (
    <figure className={clsx(s.figure, className)}>
      <div aria-describedby={tableId} aria-label={ariaLabel} className={s.frame} hidden={isTable} role='img' style={{ height }}>
        <ParentSize debounceTime={40}>{({ width }) => width > 0 && children(width)}</ParentSize>
      </div>
      <ChartDataTable caption={ariaLabel} formatValue={formatValue} id={tableId} isVisible={isTable} labels={labels} series={series} />
      {hasTableToggle && (
        <button aria-controls={tableId} aria-expanded={isTable} className={s.tableToggle} type='button' onClick={() => toggleTable()}>
          {isTable ? t('showChart') : t('showTable')}
        </button>
      )}
    </figure>
  );
};
