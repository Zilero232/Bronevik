'use client';

import { UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { Button, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { useSettingsPanel } from '../../../model/hooks';
import { SettingsForm } from '../SettingsForm';

export const SettingsPanel = () => {
  const t = useTranslations('streamer.settings.noProfile');
  const { data: view, isPending, isError, isFetching, refetch, onOpenProfile } = useSettingsPanel();

  return match({ isPending, isError, view })
    .with({ isPending: true }, () => <Skeleton height={620} shape='block' />)
    .with({ isError: true }, () => <ErrorState isRetrying={isFetching} onRetry={() => void refetch()} />)
    .with({ view: P.nonNullable }, ({ view: current }) => <SettingsForm key={current.updatedAt ?? current.slug} view={current} />)
    .otherwise(() => (
      <EmptyState
        action={
          <Button type='button' onClick={onOpenProfile}>
            {t('action')}
          </Button>
        }
        description={t('description')}
        icon={<UserRound size={20} />}
        title={t('title')}
      />
    ));
};
