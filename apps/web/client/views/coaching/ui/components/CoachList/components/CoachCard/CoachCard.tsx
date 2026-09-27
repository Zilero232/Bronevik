'use client';

import { Star } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { TankStrip } from '@/entities/tank/tank';
import { PlayerStatsLine } from '@/features/community/player-stats';
import { Link } from '@/shared/i18n/navigation';
import { Avatar, Card } from '@/ui-kit';

import type { CoachCardProps } from './CoachCard.types';

import { useCoachCard } from '../../../../../model/hooks';

import s from './CoachCard.module.scss';

export const CoachCard = ({ coach }: CoachCardProps) => {
  const t = useTranslations('coaching.card');
  const format = useFormatter();
  const { href, vehicles, moreTanks, activeOffers } = useCoachCard(coach);

  return (
    <Card className={s.root} padding='sm'>
      <header className={s.head}>
        <Avatar name={coach.name} size='md' src={coach.image ?? undefined} />
        <div className={s.identity}>
          <Link className={s.name} href={href}>
            {coach.name}
          </Link>
          <p className={s.headline}>{coach.headline}</p>
        </div>
        <div className={s.score}>
          {coach.rating !== null && (
            <span className={s.rating}>
              <Star size={13} />
              {format.number(coach.rating, { maximumFractionDigits: 1 })}
            </span>
          )}
          <span className={s.done}>{t('sessions', { count: coach.ordersDone })}</span>
        </div>
      </header>
      <PlayerStatsLine stats={coach.stats} />
      {vehicles.length > 0 && <TankStrip label={t('tanks')} more={moreTanks} vehicles={vehicles} />}
      <footer className={s.foot}>
        <span className={s.offers}>{t('offers', { count: activeOffers })}</span>
        <Link className={s.open} href={href}>
          {t('open')}
        </Link>
      </footer>
    </Card>
  );
};
