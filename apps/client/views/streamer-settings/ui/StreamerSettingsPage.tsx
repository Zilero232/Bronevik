'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { EmptyState, PageHeader, Skeleton } from '@/ui-kit';
import { ResourceGate } from '@/widgets/resource-missing';

import type { StreamerSettingsPageProps } from './StreamerSettingsPage.types';

import { useStreamerSettingsPage } from '../model/hooks';
import { ModsFairPlay, SettingsActions, SettingsGroupPanel, SettingsHistory } from './components';

import s from './StreamerSettingsPage.module.scss';

export const StreamerSettingsPage = ({ slug }: StreamerSettingsPageProps) => {
  const t = useTranslations('streamerSettings.page');
  const format = useFormatter();
  const { query, groups } = useStreamerSettingsPage(slug);

  return (
    <div className={s.root}>
      <ResourceGate
        skeleton={
          <>
            <Skeleton height={96} shape='block' />
            <Skeleton height={320} shape='block' />
          </>
        }
        className={s.skeleton}
        error={{ title: t('errorTitle'), description: t('errorDescription') }}
        query={query}
      >
        {(loaded) => (
          <>
            <PageHeader
              breadcrumbs={[
                { label: t('crumbs.settings'), href: ROUTES.streamers.settings.table },
                { label: loaded.displayName, href: ROUTES.streamers.profile(loaded.slug) }
              ]}
              actions={groups.length > 0 && <SettingsActions view={loaded} />}
              description={t('description')}
              meta={loaded.updatedAt && <span className={s.meta}>{t('updated', { date: format.dateTime(new Date(loaded.updatedAt), 'date') })}</span>}
              title={t('title', { name: loaded.displayName })}
            />
            {groups.length === 0 ? (
              <EmptyState description={t('emptyDescription')} icon={<SlidersHorizontal size={20} />} title={t('emptyTitle')} />
            ) : (
              <div className={s.groups}>
                {groups.map((group) => (
                  <SettingsGroupPanel key={group.group} group={group}>
                    {group.group === 'mods' && <ModsFairPlay />}
                  </SettingsGroupPanel>
                ))}
              </div>
            )}
            <SettingsHistory slug={loaded.slug} />
          </>
        )}
      </ResourceGate>
    </div>
  );
};
