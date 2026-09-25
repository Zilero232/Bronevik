'use client';

import { useParams } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';

import { useClanPage } from '../model/hooks';
import { ClanBases, ClanEvents, ClanHero, ClanMissing, ClanRoster, ClanSkeleton } from './components';

import s from './ClanPage.module.scss';

export const ClanPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const clanTag = decodeURIComponent(tag);
  const { data: page, isPending, error, refetch } = useClanPage(clanTag);

  return (
    <div className={s.root} style={{ '--clan': page?.clan.color ?? undefined }}>
      {match({ page, isPending, error })
        .with({ page: P.nonNullable }, ({ page: loaded }) => (
          <>
            <ClanHero page={loaded} />
            <div className={s.sections}>
              <ClanRoster members={loaded.members} now={loaded.updatedAt} />
              <ClanEvents clanId={loaded.clan.clanId} now={loaded.updatedAt} />
              <ClanBases clanId={loaded.clan.clanId} />
            </div>
          </>
        ))
        .with({ isPending: true }, () => <ClanSkeleton />)
        .with({ error: P.when(isNotFoundError) }, () => <ClanMissing reason='notFound' tag={clanTag} />)
        .otherwise(() => (
          <ClanMissing reason='error' tag={clanTag} onRetry={() => refetch()} />
        ))}
    </div>
  );
};
