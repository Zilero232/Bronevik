'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';
import { EmptyState, ErrorState, PageHeader, Skeleton } from '@/ui-kit';

import type { StreamerSettingsPageProps } from './StreamerSettingsPage.types';

import { useStreamerSettingsPage } from '../model/hooks';
import { ModReferences, SettingsActions, SettingsGroupPanel, SettingsHistory } from './components';

import s from './StreamerSettingsPage.module.scss';

export const StreamerSettingsPage = ({ slug }: StreamerSettingsPageProps) => {
  const t = useTranslations('streamerSettings.page');
  const format = useFormatter();
  const { view, groups, isPending, isRetrying, error, retry } = useStreamerSettingsPage(slug);

  return (
    <div className={s.root}>
      {match({ view, isPending, error })
        .with({ view: P.nonNullable }, ({ view: loaded }) => (
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
                    {group.group === 'mods' && <ModReferences references={loaded.modReferences} />}
                  </SettingsGroupPanel>
                ))}
              </div>
            )}
            <SettingsHistory slug={loaded.slug} />
          </>
        ))
        .with({ isPending: true }, () => (
          <div aria-busy className={s.skeleton}>
            <Skeleton height={96} shape='block' />
            <Skeleton height={320} shape='block' />
          </div>
        ))
        .with({ error: P.when(isNotFoundError) }, () => notFound())
        .otherwise(() => (
          <ErrorState description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />
        ))}
    </div>
  );
};
