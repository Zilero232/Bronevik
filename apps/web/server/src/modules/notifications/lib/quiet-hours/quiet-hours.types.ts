export type QuietHours = {
  start: number;
  end: number;
};

export type QuietDelayInput = {
  quietHours: QuietHours | null;
  now: Date;
  timeZone: string;
};

export type IsInsideInput = {
  quietHours: QuietHours;
  hour: number;
};
