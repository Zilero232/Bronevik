'use client';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { GitCompareArrows } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { useCompareResult } from '../../../model/hooks';
import { CompareTable } from '../CompareTable';

export const CompareResult = () => {
  const t = useTranslations('streamerSettings.compare');
  const { columns, isComparable, isShareMissing, query } = useCompareResult();

  return (
    <>
      {isShareMissing && <EmptyState isCompact description={t('noShareDescription')} title={t('noShareTitle')} />}
      <QueryState
        empty={
          isComparable ? (
            <EmptyState title={t('noValues')} />
          ) : (
            <EmptyState
              description={t('emptyDescription', { min: STREAMER_SETTINGS.compareMin, max: STREAMER_SETTINGS.compareMax })}
              icon={<GitCompareArrows size={20} />}
              title={t('emptyTitle')}
            />
          )
        }
        query={query}
        skeleton={<Skeleton height={320} shape='block' />}
      >
        {(sections) => <CompareTable columns={columns} sections={sections} />}
      </QueryState>
    </>
  );
};
