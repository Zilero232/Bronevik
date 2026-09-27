'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankShowcaseCard } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { WrappedBestProps } from './WrappedBest.types';

import { WrappedFact } from '../WrappedFact';

import s from './WrappedBest.module.scss';

export const WrappedBest = ({ bestBattle, bestVehicle }: WrappedBestProps) => {
  const t = useTranslations('wrapped.chapters.best');
  const format = useFormatter();

  return (
    <div className={s.root}>
      {bestVehicle && (
        <TankShowcaseCard
          href={ROUTES.tanks.detail(bestVehicle.slug)}
          layout='row'
          meta={format.dateTime(new Date(bestBattle.at), 'date')}
          vehicle={bestVehicle}
        />
      )}
      <div className={s.facts}>
        <WrappedFact isHero label={t('damage')} value={bestBattle.damageDealt} />
        <WrappedFact label={t('frags')} value={bestBattle.frags} />
      </div>
      {bestBattle.replayId && (
        <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.replays.detail(bestBattle.replayId)}>
          {t('replay')}
        </Link>
      )}
    </div>
  );
};
