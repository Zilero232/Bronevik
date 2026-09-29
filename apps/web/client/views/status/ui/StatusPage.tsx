'use client';

import { HeartPulse } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataSourceNote, PageHero, SectionHeader, Skeleton } from '@/ui-kit';

import { STATUS_PAGE } from '../config';
import { useStatusPage } from '../model/hooks';
import { StatusComponent, StatusVerdict } from './components';

import s from './StatusPage.module.scss';

export const StatusPage = () => {
  const t = useTranslations('status.page');
  const tCommon = useTranslations('common');
  const { summary, isPending, isFetching, checkedAt, onRefresh } = useStatusPage();

  return (
    <div className={s.root}>
      <PageHero
        art={{ kind: 'emblem', glyph: <HeartPulse size={STATUS_PAGE.heroGlyph} strokeWidth={1.25} /> }}
        breadcrumbs={[{ label: tCommon('home'), href: ROUTES.home }, { label: t('title') }]}
        lead={t('lead')}
        title={t('title')}
      />
      <div className={s.body}>
        {isPending ? (
          <Skeleton height={STATUS_PAGE.skeletonHeight} shape='block' />
        ) : (
          <StatusVerdict checkedAt={checkedAt} isFetching={isFetching} status={summary.status} verdict={summary.verdict} onRefresh={onRefresh} />
        )}
        <section className={s.section}>
          <SectionHeader as='h2' description={t('componentsLead')} title={t('componentsTitle')} />
          <ul className={s.grid}>
            {summary.components.map((component) => (
              <StatusComponent key={component.key} component={component} />
            ))}
          </ul>
        </section>
        <section className={s.section}>
          <SectionHeader as='h2' title={t('sourcesTitle')} />
          <ul className={s.sources}>
            <li>{t('sources.lesta')}</li>
            <li>{t('sources.mod')}</li>
            <li>{t('sources.replays')}</li>
            <li>{t('sources.files')}</li>
          </ul>
        </section>
        <DataSourceNote />
      </div>
    </div>
  );
};
