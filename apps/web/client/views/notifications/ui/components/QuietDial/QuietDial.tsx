'use client';

import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';

import type { QuietDialProps } from './QuietDial.types';

import { useQuietDial } from '../../../model/hooks';

import s from './QuietDial.module.scss';

export const QuietDial = ({ range }: QuietDialProps) => {
  const t = useTranslations('notifications.quiet');
  const { dial, span, start, end, isQuietNow, isCrossingMidnight, arc, needle, ticks, labels } = useQuietDial(range);

  return (
    <figure className={s.root} data-quiet-now={isQuietNow}>
      <svg aria-label={t('dialLabel', { start, end })} className={s.dial} role='img' viewBox={`0 0 ${dial.size} ${dial.size}`}>
        <circle className={s.face} cx={dial.center} cy={dial.center} r={dial.tickOuter + 4} />
        <circle className={s.track} cx={dial.center} cy={dial.center} r={dial.arcRadius} />
        {span > 0 && <m.path animate={{ d: arc }} className={s.arc} initial={false} />}
        {ticks.map(({ hour, isMajor, isQuiet, from, to }) => (
          <line key={hour} className={s.tick} data-major={isMajor} data-quiet={isQuiet} x1={from.x} x2={to.x} y1={from.y} y2={to.y} />
        ))}
        {labels.map(({ hour, text, x, y }) => (
          <text key={hour} className={s.label} x={x} y={y}>
            {text}
          </text>
        ))}
        {needle && <line className={s.needle} x1={dial.center} x2={needle.x} y1={dial.center} y2={needle.y} />}
        <circle className={s.hub} cx={dial.center} cy={dial.center} r={4} />
      </svg>
      <figcaption className={s.caption}>
        <span className={s.span}>{t('span', { count: span })}</span>
        <span className={s.range}>
          {start} → {end}
        </span>
        {isCrossingMidnight && <span className={s.badge}>{t('crossesMidnight')}</span>}
        <span className={s.now}>{isQuietNow ? t('nowQuiet') : t('nowLoud')}</span>
      </figcaption>
    </figure>
  );
};
