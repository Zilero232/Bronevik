'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { RATINGS_SOURCES } from '../../../config';

import s from './SourcesNote.module.scss';

export const SourcesNote = () => {
  const t = useTranslations('methodology.sources');
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={s.root} id='sources'>
      <h2 className={s.title} id={titleId}>
        {t('title')}
      </h2>
      <ul className={s.list}>
        <li>
          {t('xvm')}{' '}
          <a className={s.link} href={RATINGS_SOURCES.xvm} rel='noreferrer' target='_blank'>
            {t('xvmSite')}
          </a>
          {' · '}
          <a className={s.link} href={RATINGS_SOURCES.wn8Expected} rel='noreferrer' target='_blank'>
            {t('xvmData')}
          </a>
        </li>
        <li>{t('noCopy')}</li>
        <li>{t('wn8Formula')}</li>
        <li>{t('eff')}</li>
        <li>{t('own')}</li>
      </ul>
    </section>
  );
};
