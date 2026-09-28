'use client';

import { OtmetkiLogoIcon } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Band, PageHero } from '@/ui-kit';

import { MOD_PAGE } from '../config';
import { ModActions, ModFairPlay, ModFaq, ModFeatures, ModInstall, ModSwitches } from './components';

import s from './ModPage.module.scss';

export const ModPage = () => {
  const t = useTranslations('mod.hero');

  return (
    <div className={s.root}>
      <PageHero
        actions={<ModActions />}
        art={{ kind: 'emblem', glyph: <OtmetkiLogoIcon size={MOD_PAGE.heroGlyph} /> }}
        breadcrumbs={[{ label: t('home'), href: ROUTES.home }, { label: t('crumb') }]}
        eyebrow={t('eyebrow')}
        lead={t('lead')}
        title={t('title')}
      />
      <div className={s.section}>
        <ModFeatures />
      </div>
      <Band tone='raised'>
        <ModFairPlay />
      </Band>
      <div className={s.section}>
        <ModInstall />
      </div>
      <Band tone='deep'>
        <ModSwitches />
      </Band>
      <div className={s.section}>
        <ModFaq />
      </div>
    </div>
  );
};
