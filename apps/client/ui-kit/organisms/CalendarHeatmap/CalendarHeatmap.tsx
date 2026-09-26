'use client';

import { clsx } from 'clsx';
import { useLocale } from 'next-intl';
import { useState } from 'react';

import { calendarLayout, heatLevel, useScrollToEnd } from '@/shared/lib';

import type { CalendarHeatmapProps, HeatmapDay } from './CalendarHeatmap.types';

import { CALENDAR_HEATMAP } from './CalendarHeatmap.constants';

import s from './CalendarHeatmap.module.scss';

export const CalendarHeatmap = ({ days, levels = CALENDAR_HEATMAP.levels, ariaLabel, legend, className, renderReadout }: CalendarHeatmapProps) => {
  const locale = useLocale();

  const [active, setActive] = useState<HeatmapDay | null>(null);

  const scrollerRef = useScrollToEnd<HTMLDivElement>(days.length);

  const { weeks, months } = calendarLayout(days);
  const max = Math.max(0, ...days.map(({ value }) => value));
  const monthFormat = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' });

  return (
    <div className={clsx(s.root, className)}>
      <div ref={scrollerRef} className={s.scroller}>
        <div aria-label={ariaLabel} className={s.grid} role='img' style={{ gridTemplateColumns: `repeat(${weeks.length}, var(--cell))` }}>
          {months.map(({ index, date }) => (
            <span aria-hidden key={date} className={s.month} style={{ gridColumn: index + 1 }}>
              {monthFormat.format(new Date(`${date}T00:00:00Z`))}
            </span>
          ))}
          {weeks.map((week, column) =>
            week.map(({ key, day }, row) => (
              <span
                aria-hidden
                key={key}
                className={s.cell}
                data-active={day !== null && day.date === active?.date}
                data-empty={day === null}
                data-level={day ? heatLevel({ value: day.value, max, levels }) : 0}
                style={{ gridColumn: column + 1, gridRow: row + 2 }}
                onPointerDown={() => setActive(day)}
                onPointerEnter={() => setActive(day)}
                onPointerLeave={(event) => event.pointerType !== 'touch' && setActive(null)}
              />
            ))
          )}
        </div>
      </div>
      <div className={s.foot}>
        <span aria-live='polite' className={s.readout}>
          {renderReadout?.(active)}
        </span>
        {legend && (
          <span aria-hidden className={s.legend}>
            {legend.less}
            {Array.from({ length: levels }, (_, level) => (
              <span key={level} className={s.cell} data-level={level} />
            ))}
            {legend.more}
          </span>
        )}
      </div>
    </div>
  );
};
