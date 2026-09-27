'use client';

import type { LeaderboardScope } from '@otmetki/schemas';

import { MasteryIcon } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { ActionStrip, Card, DataSourceNote, PageHero, Tabs } from '@/ui-kit';

import { TOP_SCOPES } from '../config';
import { useTopParams } from '../model/hooks';
import { TopFilters, TopPodium, TopTable } from './components';

import s from './TopPage.module.scss';

export const TopPage = () => {
  const t = useTranslations('top');
  const [{ scope }, setParams] = useTopParams();

  return (
    <div className={s.root}>
      <PageHero
        art={{ kind: 'emblem', glyph: <MasteryIcon level='master' size={480} /> }}
        breadcrumbs={[{ label: t('hero.home'), href: ROUTES.home }, { label: t('title') }]}
        lead={t('description')}
        title={t('title')}
      />
      <ActionStrip
        start={
          <Tabs<LeaderboardScope>
            items={TOP_SCOPES.map((value) => ({ value, label: t(`scopes.${value}`) }))}
            value={scope}
            onValueChange={(next) => void setParams({ scope: next })}
          />
        }
        align='bottom'
      />
      <div className={s.content}>
        <TopPodium />
        <Card padding='none'>
          <div className={s.body}>
            <TopFilters />
            <TopTable />
          </div>
        </Card>
        <DataSourceNote />
      </div>
    </div>
  );
};
