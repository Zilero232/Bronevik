'use client';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { GitCompareArrows } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { EmptyState, ErrorState, PageHeader, Skeleton } from '@/ui-kit';

import { useSettingsCompare } from '../model/hooks';
import { ComparePicker, CompareTable } from './components';

import s from './StreamersSettingsComparePage.module.scss';

export const StreamersSettingsComparePage = () => {
  const t = useTranslations('streamerSettings.compare');
  const {
    columns,
    sections,
    isMine,
    isSignedIn,
    isShareMissing,
    canAdd,
    addItems,
    picked,
    isPending,
    isError,
    isRetrying,
    retry,
    onAdd,
    onRemove,
    onMineChange
  } = useSettingsCompare();

  return (
    <div className={s.root}>
      <PageHeader breadcrumbs={[{ label: t('crumb'), href: ROUTES.streamers.settings.table }]} description={t('description')} title={t('title')} />
      <ComparePicker
        addItems={addItems}
        canAdd={canAdd}
        isMine={isMine}
        isSignedIn={isSignedIn}
        picked={picked}
        onAdd={onAdd}
        onMineChange={onMineChange}
        onRemove={onRemove}
      />
      {isShareMissing && <EmptyState isCompact description={t('noShareDescription')} title={t('noShareTitle')} />}
      {isError && <ErrorState isRetrying={isRetrying} onRetry={retry} />}
      {!isError && isPending && <Skeleton height={320} shape='block' />}
      {!isError && !isPending && columns.length < STREAMER_SETTINGS.compareMin && (
        <EmptyState
          description={t('emptyDescription', { min: STREAMER_SETTINGS.compareMin, max: STREAMER_SETTINGS.compareMax })}
          icon={<GitCompareArrows size={20} />}
          title={t('emptyTitle')}
        />
      )}
      {!isError &&
        !isPending &&
        columns.length >= STREAMER_SETTINGS.compareMin &&
        (sections.length > 0 ? <CompareTable columns={columns} sections={sections} /> : <EmptyState title={t('noValues')} />)}
    </div>
  );
};
