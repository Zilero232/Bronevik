'use client';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader, EmptyState, QueryState, Skeleton } from '@/ui-kit';

import type { TankBestBattlesProps } from './TankBestBattles.types';

import { TANK_BEST_BATTLES } from '../config';
import { useTankBestBattles } from '../model/hooks';
import { BattleRow } from './components';

import s from './TankBestBattles.module.scss';

export const TankBestBattles = ({ tankId, className }: TankBestBattlesProps) => {
  const t = useTranslations('bestBattles.widget');
  const { query, allHref } = useTankBestBattles(tankId);

  return (
    <Card className={className} padding='none'>
      <CardHeader
        action={
          <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={allHref}>
            {t('all')}
            <ArrowRight size={14} />
          </Link>
        }
        meta={t('meta')}
        title={t('title')}
      />
      <QueryState
        isCompact
        skeleton={
          <div className={s.state}>
            <Skeleton height={TANK_BEST_BATTLES.limit * TANK_BEST_BATTLES.rowHeight} shape='block' width='100%' />
          </div>
        }
        empty={<EmptyState isCompact description={t('emptyDescription')} title={t('empty')} />}
        errorTitle={t('error')}
        query={query}
      >
        {(battles) => (
          <ol className={s.list}>
            {battles.map((battle) => (
              <BattleRow key={battle.key} battle={battle} />
            ))}
          </ol>
        )}
      </QueryState>
    </Card>
  );
};
