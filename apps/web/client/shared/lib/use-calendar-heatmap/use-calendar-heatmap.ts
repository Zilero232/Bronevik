'use client';

import type { KeyboardEvent, PointerEvent } from 'react';

import { useFormatter } from 'next-intl';
import { useRef, useState } from 'react';
import { range } from 'remeda';

import type { CalendarDay } from '../calendar-layout';
import type { UseCalendarHeatmapInput } from './use-calendar-heatmap.types';

import { calendarLayout, calendarStep, heatLevel, utcDay } from '../calendar-layout';
import { useScrollToEnd } from '../use-scroll-to-end';
import { CALENDAR_HEATMAP } from './use-calendar-heatmap.constants';

export const useCalendarHeatmap = ({ days, levels }: UseCalendarHeatmapInput) => {
  const format = useFormatter();
  const [active, setActive] = useState<CalendarDay | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useScrollToEnd<HTMLDivElement>(days.length);

  const { weeks, months } = calendarLayout(days);
  const max = Math.max(0, ...days.map(({ value }) => value));
  const indexOf = new Map(days.map(({ date }, index) => [date, index]));
  const tabbable = focusIndex ?? days.length - 1;

  const focusDay = (index: number) => {
    const day = days[index];

    setFocusIndex(index);
    setActive(day ?? null);
    gridRef.current?.querySelector<HTMLElement>(`[data-date='${day?.date}']`)?.focus();
  };

  return {
    gridRef,
    scrollerRef,
    active,
    columns: weeks.length,
    legend: range(0, levels),
    months: months.map(({ index, date }) => ({ index, date, label: format.dateTime(utcDay(date), CALENDAR_HEATMAP.monthFormat) })),
    cells: weeks.flatMap((week, column) =>
      week.map(({ key, day }, row) => ({
        key,
        day,
        column,
        row,
        level: day ? heatLevel({ value: day.value, max, levels }) : 0,
        label: day ? format.dateTime(utcDay(day.date), CALENDAR_HEATMAP.dayFormat) : undefined,
        tabIndex: day ? (indexOf.get(day.date) === tabbable ? 0 : -1) : undefined
      }))
    ),
    onEnter: (day: CalendarDay | null) => setActive(day),
    onLeave: (event: PointerEvent) => event.pointerType !== 'touch' && setActive(null),
    onFocus: (day: CalendarDay) => {
      setFocusIndex(indexOf.get(day.date) ?? null);
      setActive(day);
    },
    onKeyDown: (event: KeyboardEvent, day: CalendarDay) => {
      const next = calendarStep({ key: event.key, index: indexOf.get(day.date) ?? 0, count: days.length });

      if (next !== null) {
        event.preventDefault();
        focusDay(next);
      }
    }
  };
};
