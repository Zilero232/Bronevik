'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { PlusGate } from '@/features/plus/plus-gate';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Skeleton } from '@/ui-kit';
import { ResourceMissing } from '@/widgets/resource-missing';

import type { MyBattlePageProps } from './MyBattlePage.types';

import { MY_BATTLE } from '../config';
import { useMyBattle } from '../model/hooks';
import { BattleAnalysisPanel, BattleCard } from './components';

import s from './MyBattlePage.module.scss';

export const MyBattlePage = ({ id }: MyBattlePageProps) => {
  const t = useTranslations('analytics.battle');
  const { battle, isPending, isNotFound, isRetrying, retry } = useMyBattle(id);

  return (
    <div className={s.root}>
      <Link className={s.back} href={ROUTES.account.analytics}>
        <ArrowLeft size={14} />
        {t('back')}
      </Link>
      {match({ battle, isPending, isNotFound })
        .with({ battle: P.nonNullable }, ({ battle: value }) => (
          <>
            <BattleCard battle={value} />
            <PlusGate feature='battleAnalysis'>
              <BattleAnalysisPanel id={id} />
            </PlusGate>
          </>
        ))
        .with({ isPending: true }, () => <Skeleton height={MY_BATTLE.skeletonHeight} shape='block' />)
        .with({ isNotFound: true }, () => (
          <ResourceMissing
            back={{ href: ROUTES.account.analytics, label: t('back') }}
            description={t('notFoundText')}
            reason='notFound'
            title={t('notFoundTitle')}
          />
        ))
        .otherwise(() => (
          <ResourceMissing
            back={{ href: ROUTES.account.analytics, label: t('back') }}
            description={t('errorText')}
            isRetrying={isRetrying}
            reason='error'
            title={t('errorTitle')}
            onRetry={retry}
          />
        ))}
    </div>
  );
};
