export type ZonedTimeInput = {
  value: string | null | undefined;
  timeZone?: string;
};

export type ZonedInputParts = {
  day: Date;
  hours: number;
  minutes: number;
};

export type ComposeZonedInput = {
  day: Date;
  hours: number;
  minutes: number;
  timeZone?: string;
};

export type RoundedZonedInput = {
  now: number | Date;
  stepMinutes: number;
  timeZone?: string;
};
