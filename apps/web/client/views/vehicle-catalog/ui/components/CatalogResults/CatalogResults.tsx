'use client';

import { useTranslations } from 'next-intl';

import { QueryState } from '@/ui-kit';

import type { CatalogResultsProps } from './CatalogResults.types';

import { CatalogSkeleton } from '../CatalogSkeleton';
import { TierSection } from '../TierSection';

import s from './CatalogResults.module.scss';

export const CatalogResults = ({ query, empty, summary }: CatalogResultsProps) => {
  const t = useTranslations('vehicleCatalog.error');

  return (
    <QueryState
      empty={empty}
      errorDescription={t('description')}
      errorTitle={t('title')}
      isEmpty={(data) => data.shown === 0}
      query={query}
      skeleton={<CatalogSkeleton />}
    >
      {(data) => (
        <div className={s.root}>
          {summary?.(data.shown)}
          {data.groups.map((group) => (
            <TierSection key={group.tier} group={group} />
          ))}
        </div>
      )}
    </QueryState>
  );
};
