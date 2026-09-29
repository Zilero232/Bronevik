import { daysInWeek } from 'date-fns/constants';
import { chunk, clamp } from 'remeda';

import type { CalendarCell, CalendarDay, CalendarLayout, CalendarStepInput, CalendarWeek, HeatLevelInput } from './calendar-layout.types';

import { CALENDAR_LAYOUT } from './calendar-layout.constants';

const STEP_BY_KEY = new Map<string, number>(Object.entries(CALENDAR_LAYOUT.steps));

export const utcDay = (date: string) => new Date(`${date}T00:00:00Z`);

const mondayIndex = (date: string) => (utcDay(date).getUTCDay() + daysInWeek - 1) % daysInWeek;

const isMonthStart = (date: string) => date.endsWith(CALENDAR_LAYOUT.monthStartSuffix);

export const heatLevel = ({ value, max, levels }: HeatLevelInput): number => {
  if (value <= 0 || max <= 0) {
    return 0;
  }

  return Math.min(levels - 1, Math.max(1, Math.ceil((value / max) * (levels - 1))));
};

export const calendarLayout = (days: CalendarDay[]): CalendarLayout => {
  if (days.length === 0) {
    return { weeks: [], months: [] };
  }

  const offset = mondayIndex(days[0].date);
  const pad = (length: number): CalendarCell[] => Array.from({ length }, (_, slot) => ({ key: `pad-${offset}-${slot}-${length}`, day: null }));
  const cells: CalendarCell[] = [...pad(offset), ...days.map((day) => ({ key: day.date, day }))];
  const weeks: CalendarWeek[] = chunk(cells, daysInWeek).map((week) => [
    ...week,
    ...pad(daysInWeek - week.length).map((cell) => ({ ...cell, key: `tail-${cell.key}` }))
  ]);

  const months = weeks.flatMap((week, index) => {
    const firstOfMonth = week.find(({ day }) => day && isMonthStart(day.date))?.day;
    const first = firstOfMonth ?? (index === 0 ? week.find(({ day }) => day !== null)?.day : undefined);

    return first ? [{ index, date: first.date }] : [];
  });

  const [lead, next] = months;
  const isCrowded = lead && next && !isMonthStart(lead.date) && next.index - lead.index < CALENDAR_LAYOUT.minLabelGapWeeks;

  return { weeks, months: isCrowded ? months.slice(1) : months };
};

export const calendarStep = ({ key, index, count }: CalendarStepInput): number | null => {
  if (key === 'Home') {
    return 0;
  }

  if (key === 'End') {
    return count - 1;
  }

  const step = STEP_BY_KEY.get(key);

  return step === undefined ? null : clamp(index + step, { min: 0, max: count - 1 });
};
