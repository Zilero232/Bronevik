'use client';

import { minutesInHour } from 'date-fns/constants';
import { useNow } from 'next-intl';

import type { QuietHours } from '../../../lib/quiet-hours';

import { QUIET_HOURS } from '../../../config';
import { crossesMidnight, dayHours, dialPoint, formatHour, isQuietHour, quietArcPath, quietSpan } from '../../../lib/quiet-hours';

export const useQuietDial = (range: QuietHours) => {
  const now = useNow({ updateInterval: QUIET_HOURS.nowTickMs });

  const { dial } = QUIET_HOURS;
  const { center, arcRadius, tickOuter, tickInner, majorTickInner, labelRadius, needleInset } = dial;
  const span = quietSpan(range);
  const hours = dayHours();
  const isMajor = (hour: number) => hour % QUIET_HOURS.majorEvery === 0;

  return {
    dial,
    span,
    start: formatHour(range.start),
    end: formatHour(range.end),
    isQuietNow: span > 0 && isQuietHour({ hour: now.getHours(), range }),
    isCrossingMidnight: crossesMidnight(range),
    arc: quietArcPath({ range, center, radius: arcRadius }),
    needle: dialPoint({ hour: now.getHours() + now.getMinutes() / minutesInHour, center, radius: labelRadius - needleInset }),
    ticks: hours.map((hour) => ({
      hour,
      isMajor: isMajor(hour),
      isQuiet: isQuietHour({ hour, range }),
      from: dialPoint({ hour, center, radius: isMajor(hour) ? majorTickInner : tickInner }),
      to: dialPoint({ hour, center, radius: tickOuter })
    })),
    labels: hours.filter(isMajor).map((hour) => ({ hour, text: String(hour).padStart(2, '0'), ...dialPoint({ hour, center, radius: labelRadius }) }))
  };
};
