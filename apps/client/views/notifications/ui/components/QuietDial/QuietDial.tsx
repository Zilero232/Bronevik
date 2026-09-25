'use client';

import { motion } from 'motion/react';
import { useNow, useTranslations } from 'next-intl';

import type { QuietDialProps } from './QuietDial.types';

import { QUIET_HOURS } from '../../../config';
import { crossesMidnight, dialPoint, formatHour, isQuietHour, QUIET_DIAL, quietArcPath, quietSpan } from '../../../lib/quiet-hours';

import s from './QuietDial.module.scss';

const HOURS = Array.from({ length: QUIET_DIAL.hours }, (_, hour) => hour);
const NOW_TICK_MS = 60_000;
const MINUTES_IN_HOUR = 60;

export const QuietDial = ({ range }: QuietDialProps) => {
  const t = useTranslations('notifications.quiet');
  const now = useNow({ updateInterval: NOW_TICK_MS });

  const { size, center, arcRadius, tickOuter, tickInner, majorTickInner, labelRadius } = QUIET_HOURS.dial;
  const span = quietSpan(range);
  const isQuietNow = span > 0 && isQuietHour({ hour: now.getHours(), range });
  const needle = dialPoint({ hour: now.getHours() + now.getMinutes() / MINUTES_IN_HOUR, center, radius: labelRadius - 14 });

  return (
    <figure className={s.root} data-quiet-now={isQuietNow}>
      <svg
        aria-label={t('dialLabel', { start: formatHour(range.start), end: formatHour(range.end) })}
        className={s.dial}
        role='img'
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle className={s.face} cx={center} cy={center} r={tickOuter + 4} />
        <circle className={s.track} cx={center} cy={center} r={arcRadius} />
        {span > 0 && <motion.path animate={{ d: quietArcPath({ range, center, radius: arcRadius }) }} className={s.arc} initial={false} />}
        {HOURS.map((hour) => {
          const isMajor = hour % QUIET_HOURS.majorEvery === 0;
          const from = dialPoint({ hour, center, radius: isMajor ? majorTickInner : tickInner });
          const to = dialPoint({ hour, center, radius: tickOuter });

          return (
            <line
              key={hour}
              className={s.tick}
              data-major={isMajor}
              data-quiet={isQuietHour({ hour, range })}
              x1={from.x}
              x2={to.x}
              y1={from.y}
              y2={to.y}
            />
          );
        })}
        {HOURS.filter((hour) => hour % QUIET_HOURS.majorEvery === 0).map((hour) => {
          const { x, y } = dialPoint({ hour, center, radius: labelRadius });

          return (
            <text key={hour} className={s.label} x={x} y={y}>
              {String(hour).padStart(2, '0')}
            </text>
          );
        })}
        <line className={s.needle} x1={center} x2={needle.x} y1={center} y2={needle.y} />
        <circle className={s.hub} cx={center} cy={center} r={4} />
      </svg>
      <figcaption className={s.caption}>
        <span className={s.span}>{t('span', { count: span })}</span>
        <span className={s.range}>
          {formatHour(range.start)} → {formatHour(range.end)}
        </span>
        {crossesMidnight(range) && <span className={s.badge}>{t('crossesMidnight')}</span>}
        <span className={s.now}>{isQuietNow ? t('nowQuiet') : t('nowLoud')}</span>
      </figcaption>
    </figure>
  );
};
