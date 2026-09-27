export type RussianDateInput = {
  text: string;
  reference: Date;
};

export type MoscowDateInput = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export type YearForInput = {
  month: number;
  reference: Date;
  explicit: string | undefined;
};
