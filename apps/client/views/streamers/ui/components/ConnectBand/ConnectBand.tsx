'use client';

import { useTranslations } from 'next-intl';

import { Band, SectionHeader } from '@/ui-kit';

import { CONNECT_STEPS } from '../../../config';

import s from './ConnectBand.module.scss';

export const ConnectBand = () => {
  const t = useTranslations('streamers.connect');

  return (
    <Band innerClassName={s.inner}>
      <SectionHeader description={t('description')} title={t('title')} variant='display' />
      <ol className={s.steps}>
        {CONNECT_STEPS.map((step, index) => (
          <li key={step} className={s.step}>
            <span aria-hidden className={s.index}>
              {index + 1}
            </span>
            <h3 className={s.title}>{t(`steps.${step}.title`)}</h3>
            <p className={s.text}>{t(`steps.${step}.text`)}</p>
          </li>
        ))}
      </ol>
    </Band>
  );
};
