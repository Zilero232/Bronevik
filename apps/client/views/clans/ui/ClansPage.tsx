'use client';

import { StrongholdIcon } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataSourceNote, PageHero } from '@/ui-kit';

import { useClanLeaders } from '../model/hooks';
import { ClanLeaders, ClanRating, ClanSearch } from './components';

import s from './ClansPage.module.scss';

export const ClansPage = () => {
  const t = useTranslations('clans.head');
  const { leaders } = useClanLeaders();

  return (
    <div className={s.root}>
      <PageHero
        actions={<ClanSearch />}
        art={{ kind: 'emblem', glyph: <StrongholdIcon size={480} /> }}
        breadcrumbs={[{ label: t('home'), href: ROUTES.home }, { label: t('title') }]}
        lead={t('description')}
        title={t('title')}
      />
      {leaders.length > 0 && <ClanLeaders leaders={leaders} />}
      <div className={s.content}>
        <ClanRating />
        <DataSourceNote />
      </div>
    </div>
  );
};
