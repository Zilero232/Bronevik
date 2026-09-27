'use client';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { GitCompareArrows } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { useCompareResult } from '../../../model/hooks';
import { CompareTable } from '../CompareTable';

export const CompareResult = () => {
  const t = useTranslations('streamerSettings.compare');
  const { columns, sections, isComparable, isShareMissing, isPending, isError, isRetrying, retry } = useCompareResult();

  return (
    <>
      {isShareMissing && <EmptyState isCompact description={t('noShareDescription')} title={t('noShareTitle')} />}
      {match({ isError, isPending, isComparable, hasSections: sections.length > 0 })
        .with({ isError: true }, () => <ErrorState isRetrying={isRetrying} onRetry={retry} />)
        .with({ isPending: true }, () => <Skeleton height={320} shape='block' />)
        .with({ isComparable: false }, () => (
          <EmptyState
            description={t('emptyDescription', { min: STREAMER_SETTINGS.compareMin, max: STREAMER_SETTINGS.compareMax })}
            icon={<GitCompareArrows size={20} />}
            title={t('emptyTitle')}
          />
        ))
        .with({ hasSections: false }, () => <EmptyState title={t('noValues')} />)
        .otherwise(() => (
          <CompareTable columns={columns} sections={sections} />
        ))}
    </>
  );
};
