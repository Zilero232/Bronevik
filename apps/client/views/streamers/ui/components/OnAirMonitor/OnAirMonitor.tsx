'use client';

import { useTranslations } from 'next-intl';

import { OverlayBoard } from '@/entities/streamer/overlay';

import { DEMO_CONFIG } from '../../../config';
import { formatRecordingClock } from '../../../lib/demo-overlay';
import { useDemoOverlay } from '../../../model/hooks';

import s from './OnAirMonitor.module.scss';

export const OnAirMonitor = () => {
  const t = useTranslations('streamers.hero');
  const { data, seconds } = useDemoOverlay();

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
          <span className={s.clock}>{formatRecordingClock(seconds)}</span>
          <span className={s.channel}>{t('channel')}</span>
        </div>
        <OverlayBoard config={DEMO_CONFIG} data={data} />
      </div>
      <figcaption className={s.caption}>{t('frame')}</figcaption>
    </figure>
  );
};
