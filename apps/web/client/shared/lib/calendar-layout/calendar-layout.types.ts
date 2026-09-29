export type CalendarDay = {
  date: string;
  value: number;
};

export type CalendarCell = {
  key: string;
  day: CalendarDay | null;
};

export type CalendarWeek = CalendarCell[];

type CalendarMonth = {
  index: number;
  date: string;
};

export type CalendarLayout = {
  weeks: CalendarWeek[];
  months: CalendarMonth[];
};

export type CalendarStepInput = {
  key: string;
  index: number;
  count: number;
};

export type HeatLevelInput = {
  value: number;
  max: number;
  levels: number;
};
