'use client';

import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { Button, EmptyState, SectionHeader, Skeleton } from '@/ui-kit';

import type { ClanBasesProps } from './ClanBases.types';

import { useClanStronghold } from '../../../model/hooks';
import { GlobalMapCard, StrongholdCard } from './components';

import s from './ClanBases.module.scss';

export const ClanBases = ({ clanId }: ClanBasesProps) => {
  const t = useTranslations('clans.bases');
  const { data: stronghold, isPending, refetch } = useClanStronghold(clanId);

  return (
    <section>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// 03' title={t('title')} />
      {match({ stronghold, isPending })
        .with({ stronghold: P.nonNullable }, ({ stronghold: loaded }) => (
          <div className={s.grid}>
            <StrongholdCard stronghold={loaded} />
            <GlobalMapCard globalMap={loaded.globalMap} />
          </div>
        ))
        .with({ isPending: true }, () => (
          <div aria-busy aria-label={t('loading')} className={s.grid} role='status'>
            <Skeleton height={420} shape='block' />
            <Skeleton height={420} shape='block' />
          </div>
        ))
        .otherwise(() => (
          <EmptyState
            action={
              <Button variant='secondary' onClick={() => refetch()}>
                <RotateCcw size={16} />
                {t('retry')}
              </Button>
            }
            code='ERR'
            description={t('errorDescription')}
            title={t('error')}
          />
        ))}
    </section>
  );
};
