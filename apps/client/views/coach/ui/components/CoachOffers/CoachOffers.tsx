'use client';

import { Clock, Film } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, Card, CardHeader, EmptyState } from '@/ui-kit';

import type { CoachOffersProps } from './CoachOffers.types';

import s from './CoachOffers.module.scss';

export const CoachOffers = ({ offers }: CoachOffersProps) => {
  const t = useTranslations('coaching.offers');

  return (
    <Card padding='none'>
      <CardHeader title={t('title')} />
      {offers.length === 0 ? (
        <EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />
      ) : (
        <ul className={s.list}>
          {offers.map((offer) => (
            <li key={offer.id} className={s.item}>
              <div className={s.head}>
                <span className={s.title}>{offer.title}</span>
                {offer.withReplay && (
                  <Badge tone='accent'>
                    <Film size={12} />
                    {t('withReplay')}
                  </Badge>
                )}
                <span className={s.duration}>
                  <Clock size={12} />
                  {t('duration', { minutes: offer.durationMinutes })}
                </span>
              </div>
              {offer.description && <p className={s.description}>{offer.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
