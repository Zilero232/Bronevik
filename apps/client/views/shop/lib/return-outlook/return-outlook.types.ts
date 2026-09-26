export type ReturnOutlookState = 'later' | 'overdue' | 'soon' | 'unknown';

export type ReturnOutlook = {
  state: ReturnOutlookState;
  days: number | null;
};

export type ReturnOutlookInput = {
  nextExpectedAt: string | null;
  now: Date;
  soonDays: number;
  timeZone: string;
};

export type CalendarDayInput = {
  date: Date;
  timeZone: string;
};
