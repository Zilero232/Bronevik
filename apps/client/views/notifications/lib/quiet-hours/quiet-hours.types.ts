import type { NotificationSettings } from '@bronevik/schemas';

export type QuietHours = NonNullable<NotificationSettings['quietHours']>;

export type IsQuietHourInput = {
  hour: number;
  range: QuietHours;
};

export type QuietArcInput = {
  range: QuietHours;
  center: number;
  radius: number;
};

export type DialPoint = {
  x: number;
  y: number;
};

export type DialPointInput = {
  hour: number;
  center: number;
  radius: number;
};
