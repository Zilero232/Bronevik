'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { CommandPaletteTrigger } from '@/features/search/command-palette';

import { HeroFigures, HeroStage, RecentSearches } from './components';

import s from './HomeHero.module.scss';

export const HomeHero = () => {
  const t = useTranslations('home.hero');
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={s.root}>
      <div aria-hidden className={s.scrim} />
      <div className={s.content}>
        <div className={s.main}>
          <h1 className={s.title} id={titleId}>
            {t('title')}
          </h1>
          <p className={s.lead}>{t('description')}</p>
          <div className={s.search}>
            <CommandPaletteTrigger variant='hero' />
            <RecentSearches />
          </div>
          <HeroFigures />
        </div>
        <HeroStage />
      </div>
    </section>
  );
};
