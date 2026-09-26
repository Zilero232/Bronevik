'use client';

import { useTranslations } from 'next-intl';

import { LiveLamp } from '@/entities/streamer/broadcast';

import { StudioLink } from '../StudioLink';

import s from './StreamersCta.module.scss';

export const StreamersCta = () => {
  const t = useTranslations('streamers');

  return (
    <section className={s.root}>
      <div className={s.plate}>
        <LiveLamp label={t('hero.onAir')} size='sm' />
        <h2 className={s.title}>{t('cta.title')}</h2>
        <p className={s.text}>{t('cta.text')}</p>
        <StudioLink />
      </div>
    </section>
  );
};
