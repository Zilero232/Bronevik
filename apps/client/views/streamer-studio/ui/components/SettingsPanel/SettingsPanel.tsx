'use client';

import { UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { useSettingsPanel } from '../../../model/hooks';
import { SettingsForm } from '../SettingsForm';

export const SettingsPanel = () => {
  const t = useTranslations('streamer.settings.noProfile');
  const { query, onOpenProfile } = useSettingsPanel();

  return (
    <QueryState
      empty={
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
      }
      isEmpty={(view) => view === null}
      query={query}
      skeleton={<Skeleton height={620} shape='block' />}
    >
      {(view) => view && <SettingsForm key={view.updatedAt ?? view.slug} view={view} />}
    </QueryState>
  );
};
