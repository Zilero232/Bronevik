import { round } from 'remeda';

import type { DialPoint, DialPointInput, IsQuietHourInput, QuietArcInput, QuietHours } from './quiet-hours.types';

import { QUIET_DIAL } from './quiet-hours.constants';

const wrapHour = (hour: number) => ((hour % QUIET_DIAL.hours) + QUIET_DIAL.hours) % QUIET_DIAL.hours;

export const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

export const quietSpan = ({ start, end }: QuietHours) => wrapHour(end - start);

export const crossesMidnight = ({ start, end }: QuietHours) => end < start && end !== 0;

export const isQuietHour = ({ hour, range }: IsQuietHourInput) => wrapHour(hour - range.start) < quietSpan(range);

export const quietHourList = (range: QuietHours) => Array.from({ length: quietSpan(range) }, (_, index) => wrapHour(range.start + index));

export const dialPoint = ({ hour, center, radius }: DialPointInput): DialPoint => {
  const angle = (hour / QUIET_DIAL.hours) * Math.PI * 2;

  return { x: round(center + radius * Math.sin(angle), 3), y: round(center - radius * Math.cos(angle), 3) };
};

export const quietArcPath = ({ range, center, radius }: QuietArcInput) => {
  const from = dialPoint({ hour: range.start, center, radius });
  const to = dialPoint({ hour: range.end, center, radius });
  const largeArc = quietSpan(range) > QUIET_DIAL.hours / 2 ? 1 : 0;

  return `M ${from.x} ${from.y} A ${radius} ${radius} 0 ${largeArc} 1 ${to.x} ${to.y}`;
};
