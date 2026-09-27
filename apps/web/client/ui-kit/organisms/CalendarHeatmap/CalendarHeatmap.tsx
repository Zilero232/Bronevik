'use client';

import { clsx } from 'clsx';

import { useCalendarHeatmap } from '@/shared/lib';

import type { CalendarHeatmapProps } from './CalendarHeatmap.types';

import { CALENDAR_HEATMAP } from './CalendarHeatmap.constants';

import s from './CalendarHeatmap.module.scss';

export const CalendarHeatmap = ({ days, levels = CALENDAR_HEATMAP.levels, ariaLabel, legend, className, renderReadout }: CalendarHeatmapProps) => {
  const heatmap = useCalendarHeatmap({ days, levels });

  return (
    <div className={clsx(s.root, className)}>
      <div ref={heatmap.scrollerRef} className={s.scroller}>
        <div
          ref={heatmap.gridRef}
          aria-label={ariaLabel}
          className={s.grid}
          role='group'
          style={{ gridTemplateColumns: `repeat(${heatmap.columns}, var(--cell))` }}
        >
          {heatmap.months.map(({ index, date, label }) => (
            <span aria-hidden key={date} className={s.month} style={{ gridColumn: index + 1 }}>
              {label}
            </span>
          ))}
          {heatmap.cells.map(({ key, day, column, row, level, label, tabIndex }) => (
            <span
              key={key}
              aria-hidden={day === null}
              aria-label={label}
              className={s.cell}
              data-active={day !== null && day.date === heatmap.active?.date}
              data-date={day?.date}
              data-empty={day === null}
              data-level={level}
              role={day ? 'img' : undefined}
              style={{ gridColumn: column + 1, gridRow: row + 2 }}
              tabIndex={tabIndex}
              onFocus={day ? () => heatmap.onFocus(day) : undefined}
              onKeyDown={day ? (event) => heatmap.onKeyDown(event, day) : undefined}
              onPointerDown={() => heatmap.onEnter(day)}
              onPointerEnter={() => heatmap.onEnter(day)}
              onPointerLeave={heatmap.onLeave}
            />
          ))}
        </div>
      </div>
      <div className={s.foot}>
        <span aria-live='polite' className={s.readout}>
          {renderReadout?.(heatmap.active)}
        </span>
        {legend && (
          <span aria-hidden className={s.legend}>
            {legend.less}
            {heatmap.legend.map((level) => (
              <span key={level} className={s.cell} data-level={level} />
            ))}
            {legend.more}
          </span>
        )}
      </div>
    </div>
  );
};
