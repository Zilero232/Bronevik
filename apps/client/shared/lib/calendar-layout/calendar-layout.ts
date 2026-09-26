import type { CalendarCell, CalendarDay, CalendarLayout, CalendarWeek, HeatLevelInput } from './calendar-layout.types';

const DAYS_IN_WEEK = 7;

const MIN_LABEL_GAP_WEEKS = 3;

const mondayIndex = (date: string) => (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % DAYS_IN_WEEK;

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
  const weeks: CalendarWeek[] = [];

  for (let start = 0; start < cells.length; start += DAYS_IN_WEEK) {
    const week = cells.slice(start, start + DAYS_IN_WEEK);

    weeks.push([...week, ...pad(DAYS_IN_WEEK - week.length).map((cell) => ({ ...cell, key: `tail-${cell.key}` }))]);
  }

  const months = weeks.flatMap((week, index) => {
    const firstOfMonth = week.find(({ day }) => day?.date.endsWith('-01'))?.day;
    const first = firstOfMonth ?? (index === 0 ? week.find(({ day }) => day !== null)?.day : undefined);

    return first ? [{ index, date: first.date }] : [];
  });

  const [lead, next] = months;
  const isCrowded = lead && next && !lead.date.endsWith('-01') && next.index - lead.index < MIN_LABEL_GAP_WEEKS;

  return { weeks, months: isCrowded ? months.slice(1) : months };
};
