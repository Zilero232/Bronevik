'use client';

import { useTranslations } from 'next-intl';

import { QueryState, Skeleton } from '@/ui-kit';

import type { ClanBasesProps } from './ClanBases.types';

import { useClanStronghold } from '../../../model/hooks';
import { GlobalMapCard, StrongholdCard } from './components';

export const ClanBases = ({ clanId, view }: ClanBasesProps) => {
  const t = useTranslations('clans.bases');
  const query = useClanStronghold(clanId);

  return (
    <QueryState
      errorDescription={t('errorDescription')}
      errorTitle={t('error')}
      query={query}
      skeleton={<Skeleton aria-label={t('loading')} height={320} shape='block' />}
    >
      {(stronghold) => (view === 'stronghold' ? <StrongholdCard stronghold={stronghold} /> : <GlobalMapCard globalMap={stronghold.globalMap} />)}
    </QueryState>
  );
};
