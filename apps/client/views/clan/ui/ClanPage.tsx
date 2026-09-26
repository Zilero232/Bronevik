'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';
import { DataSourceNote, Tabs } from '@/ui-kit';
import { ResourceMissing } from '@/widgets/resource-missing';

import { useClanPage } from '../model/hooks';
import { ClanBases, ClanEvents, ClanHeader, ClanRoster, ClanSkeleton } from './components';

import s from './ClanPage.module.scss';

export const ClanPage = () => {
  const t = useTranslations('clans');
  const { tag } = useParams<{ tag: string }>();
  const clanTag = decodeURIComponent(tag);
  const { data: page, isPending, isFetching, error, refetch } = useClanPage(clanTag);

  return (
    <div className={s.root}>
      {match({ page, isPending, error })
        .with({ page: P.nonNullable }, ({ page: loaded }) => (
          <>
            <ClanHeader page={loaded} />
            <Tabs
              items={[
                {
                  value: 'roster',
                  label: t('tabs.roster'),
                  count: loaded.members.length,
                  content: <ClanRoster members={loaded.members} now={loaded.updatedAt} />
                },
                { value: 'stronghold', label: t('tabs.stronghold'), content: <ClanBases clanId={loaded.clan.clanId} view='stronghold' /> },
                { value: 'globalMap', label: t('tabs.globalMap'), content: <ClanBases clanId={loaded.clan.clanId} view='globalMap' /> },
                { value: 'history', label: t('tabs.history'), content: <ClanEvents clanId={loaded.clan.clanId} now={loaded.updatedAt} /> }
              ]}
              variant='panel'
            />
            <DataSourceNote updatedAt={loaded.updatedAt} />
          </>
        ))
        .with({ isPending: true }, () => <ClanSkeleton />)
        .with({ error: P.when(isNotFoundError) }, () => (
          <ResourceMissing
            back={{ href: ROUTES.clans.list, label: t('missing.toClans') }}
            description={t('missing.notFoundDescription', { tag: clanTag })}
            reason='notFound'
            title={t('missing.notFoundTitle')}
          />
        ))
        .otherwise(() => (
          <ResourceMissing
            back={{ href: ROUTES.clans.list, label: t('missing.toClans') }}
            description={t('missing.errorDescription', { tag: clanTag })}
            isRetrying={isFetching}
            reason='error'
            title={t('missing.errorTitle')}
            onRetry={() => void refetch()}
          />
        ))}
    </div>
  );
};
