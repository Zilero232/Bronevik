'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, Card, CardHeader, KeyFigure, KeyFigures } from '@/ui-kit';

import type { DivisionCardProps } from './DivisionCard.types';

import { TierBadge } from '../TierBadge';

import s from './DivisionCard.module.scss';

export const DivisionCard = ({ division }: DivisionCardProps) => {
  const t = useTranslations('social.leagues.division');
  const tTiers = useTranslations('social.leagues.tiers');

  return (
    <Card className={s.root} padding='md' variant='panel'>
      <CardHeader
        action={
          <Badge shape='pill' tone={division.isClosed ? 'neutral' : 'accent'}>
            {division.isClosed ? t('closed') : t('live')}
          </Badge>
        }
        meta={t('group', { group: division.group, count: division.size })}
        title={<TierBadge size='lg' tier={division.tier} />}
      />
      <KeyFigures>
        <KeyFigure
          icon={<ArrowUp aria-hidden className={s.up} size={16} />}
          label={t('promotion')}
          value={division.promotesTo ? t('promotionMoves', { count: division.promotionSlots, tier: tTiers(division.promotesTo) }) : t('top')}
          variant='compact'
        />
        <KeyFigure
          icon={<ArrowDown aria-hidden className={s.down} size={16} />}
          label={t('relegation')}
          value={division.relegatesTo ? t('relegationMoves', { count: division.relegationSlots, tier: tTiers(division.relegatesTo) }) : t('bottom')}
          variant='compact'
        />
      </KeyFigures>
      <p className={s.note}>{division.isClosed ? t('closedNote') : t('liveNote')}</p>
    </Card>
  );
};
