'use client';

import { ScrollText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, SectionHeader, SkeletonStack, Timeline } from '@/ui-kit';

import { MOD_PAGE } from '../../../config';
import { useModChangelog } from '../../../model/hooks';
import { ReleaseNotes } from './components';

import s from './ModChangelog.module.scss';

export const ModChangelog = () => {
  const t = useTranslations('mod.changelog');
  const { query } = useModChangelog();

  return (
    <section className={s.root}>
      <SectionHeader description={t('lead')} title={t('title')} variant='display' />
      <QueryState
        isCompact
        empty={
          <EmptyState
            isFramed
            description={t('empty')}
            icon={<ScrollText aria-hidden size={MOD_PAGE.featureIconSize} />}
            title={t('title')}
            titleAs='h3'
          />
        }
        errorTitle={t('errorTitle')}
        isEmpty={(releases) => releases.length === 0}
        query={query}
        skeleton={<SkeletonStack heights={MOD_PAGE.changelogSkeleton} />}
      >
        {(releases) => (
          <Timeline
            items={releases.map((release, index) => ({
              id: release.version,
              date: release.date,
              dateTime: release.dateTime,
              isCurrent: index === 0,
              content: <ReleaseNotes release={release} />
            }))}
            aria-label={t('listLabel')}
            variant='card'
          />
        )}
      </QueryState>
    </section>
  );
};
