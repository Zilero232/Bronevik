'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PlusGate } from '@/features/plus/plus-gate';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Skeleton } from '@/ui-kit';
import { ResourceGate } from '@/widgets/resource-missing';

import type { MyBattlePageProps } from './MyBattlePage.types';

import { MY_BATTLE } from '../config';
import { useMyBattle } from '../model/hooks';
import { BattleAnalysisPanel, BattleCard } from './components';

import s from './MyBattlePage.module.scss';

export const MyBattlePage = ({ id }: MyBattlePageProps) => {
  const t = useTranslations('analytics.battle');
  const query = useMyBattle(id);

  return (
    <div className={s.root}>
      <Link className={s.back} href={ROUTES.account.analytics}>
        <ArrowLeft size={14} />
        {t('back')}
      </Link>
      <ResourceGate
        back={{ href: ROUTES.account.analytics, label: t('back') }}
        error={{ title: t('errorTitle'), description: t('errorText') }}
        notFound={{ title: t('notFoundTitle'), description: t('notFoundText') }}
        query={query}
        skeleton={<Skeleton height={MY_BATTLE.skeletonHeight} shape='block' />}
      >
        {(battle) => (
          <>
            <BattleCard battle={battle} />
            <PlusGate feature='battleAnalysis'>
              <BattleAnalysisPanel id={id} />
            </PlusGate>
          </>
        )}
      </ResourceGate>
    </div>
  );
};
