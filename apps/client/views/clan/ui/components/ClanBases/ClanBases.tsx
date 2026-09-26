'use client';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { ErrorState, Skeleton } from '@/ui-kit';

import type { ClanBasesProps } from './ClanBases.types';

import { useClanStronghold } from '../../../model/hooks';
import { GlobalMapCard, StrongholdCard } from './components';

export const ClanBases = ({ clanId, view }: ClanBasesProps) => {
  const t = useTranslations('clans.bases');
  const { data: stronghold, isPending, isFetching, refetch } = useClanStronghold(clanId);

  return match({ stronghold, isPending, view })
    .with({ stronghold: P.nonNullable, view: 'stronghold' }, ({ stronghold: loaded }) => <StrongholdCard stronghold={loaded} />)
    .with({ stronghold: P.nonNullable, view: 'globalMap' }, ({ stronghold: loaded }) => <GlobalMapCard globalMap={loaded.globalMap} />)
    .with({ isPending: true }, () => <Skeleton aria-label={t('loading')} height={320} shape='block' />)
    .otherwise(() => <ErrorState description={t('errorDescription')} isRetrying={isFetching} title={t('error')} onRetry={() => void refetch()} />);
};
