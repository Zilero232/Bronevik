export type RussianDateInput = {
  text: string;
  reference: Date;
};

export type MonthOfInput = {
  monthName: string;
  reference: Date;
};

export type MoscowDateInput = MonthOfInput & {
  year: number;
  day: string;
  hour: string;
  minute: string;
};

export type YearForInput = {
  month: number;
  reference: Date;
  explicit: string | undefined;
};
