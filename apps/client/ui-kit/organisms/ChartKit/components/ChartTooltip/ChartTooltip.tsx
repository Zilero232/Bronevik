import { TooltipWithBounds } from '@visx/tooltip';

import type { ChartTooltipProps } from '../../ChartKit.types';

import s from '../../ChartKit.module.scss';

export const ChartTooltip = ({ state, labels, series, formatValue }: ChartTooltipProps) => (
  <TooltipWithBounds applyPositionStyle unstyled className={s.tooltip} left={state.left} top={state.top}>
    <span className={s.tooltipLabel}>{labels[state.index]}</span>
    {series.map((item) => (
      <span key={item.id} className={s.tooltipRow} data-tone={item.tone ?? 'accent'}>
        <span className={s.tooltipSwatch} />
        <span className={s.tooltipName}>{item.label}</span>
        <span className={s.tooltipValue}>{formatValue(item.values[state.index] ?? 0)}</span>
      </span>
    ))}
  </TooltipWithBounds>
);
