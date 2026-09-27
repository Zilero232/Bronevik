'use client';

import { Star } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { PlayerStatsLine } from '@/features/community/player-stats';
import { Link } from '@/shared/i18n/navigation';
import { Card } from '@/ui-kit';

import type { CoachSummaryProps } from './CoachSummary.types';

import s from './CoachSummary.module.scss';

export const CoachSummary = ({ coach, profileHref }: CoachSummaryProps) => {
  const t = useTranslations('coaching.coach');
  const format = useFormatter();

  return (
    <Card className={s.root} padding='sm'>
      <dl className={s.facts}>
        <div className={s.fact}>
          <dt className={s.label}>{t('rating')}</dt>
          <dd className={s.rating}>
            {coach.rating === null ? (
              t('noRating')
            ) : (
              <>
                <Star size={14} />
                {format.number(coach.rating, { maximumFractionDigits: 1 })}
              </>
            )}
          </dd>
        </div>
        <div className={s.fact}>
          <dt className={s.label}>{t('sessions')}</dt>
          <dd className={s.value}>{format.number(coach.ordersDone)}</dd>
        </div>
      </dl>
      <PlayerStatsLine stats={coach.stats} />
      {profileHref && (
        <Link className={s.profile} href={profileHref}>
          {t('playerProfile')}
        </Link>
      )}
    </Card>
  );
};
