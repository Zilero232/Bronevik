'use client';

import { useTranslations } from 'next-intl';

import { MONITOR_WIDGETS } from '../../../config';

import s from './OnAirMonitor.module.scss';

export const OnAirMonitor = () => {
  const t = useTranslations('streamers.hero');
  const tKind = useTranslations('streamer.overlays.kind');

  return (
    <figure className={s.root}>
      <div className={s.screen}>
        <div aria-hidden className={s.scene} />
        <div aria-hidden className={s.scanlines} />
        <div className={s.hud}>
          <span className={s.rec}>
            <span className={s.recDot} />
            {t('rec')}
          </span>
        </div>
        <ul className={s.widgets}>
          {MONITOR_WIDGETS.map((kind) => (
            <li key={kind} className={s.widget}>
              <span className={s.widgetLabel}>{tKind(kind)}</span>
              <span aria-hidden className={s.widgetSlot} />
            </li>
          ))}
        </ul>
      </div>
      <figcaption className={s.caption}>{t('frame')}</figcaption>
    </figure>
  );
};
