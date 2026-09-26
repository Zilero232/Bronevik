'use client';

import { ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LiveLamp } from '@/entities/streamer/broadcast';
import { buttonVariants } from '@/ui-kit';

import { LANDING_ANCHORS } from '../../../config';
import { OnAirMonitor } from '../OnAirMonitor';
import { StudioLink } from '../StudioLink';

import s from './StreamersHero.module.scss';

export const StreamersHero = () => {
  const t = useTranslations('streamers.hero');

  return (
    <section className={s.root}>
      <div aria-hidden className={s.backdrop} />
      <div className={s.inner}>
        <div className={s.copy}>
          <div className={s.signal}>
            <LiveLamp label={t('onAir')} />
            <span className={s.eyebrow}>{t('eyebrow')}</span>
          </div>
          <h1 className={s.title}>{t.rich('title', { hot: (chunks) => <span className={s.hot}>{chunks}</span> })}</h1>
          <p className={s.lead}>{t('lead')}</p>
          <div className={s.actions}>
            <StudioLink />
            <a className={buttonVariants({ variant: 'ghost', size: 'lg' })} href={`#${LANDING_ANCHORS.flow}`}>
              {t('ctaHow')}
              <ArrowDown size={16} />
            </a>
          </div>
        </div>
        <div className={s.monitor}>
          <OnAirMonitor />
        </div>
      </div>
    </section>
  );
};
