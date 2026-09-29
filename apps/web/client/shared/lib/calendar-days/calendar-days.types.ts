type CalendarDate = number | string | Date;

export type ZonedDayInput = {
  date: CalendarDate;
  timeZone?: string;
};

export type DaysBetweenInput = {
  from: CalendarDate;
  to: CalendarDate;
  timeZone?: string;
};

export type DaysUntilInput = {
  date: CalendarDate;
  now: CalendarDate;
  timeZone?: string;
};

export type ShiftDayInput = {
  day: string;
  amount: number;
  timeZone?: string;
};
