import { BRONYA_INDEX } from '@bronevik/ratings';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { ratingTone } from '@/shared/lib';
import { Card, ProgressBar, RatingBadge, Sparkline } from '@/ui-kit';

import type { PlayerCardProps } from './PlayerCard.types';

import { PlayerIdentity } from './PlayerIdentity';

import s from './PlayerCard.module.scss';

export const PlayerCard = ({ player, rank, className }: PlayerCardProps) => {
  const t = useTranslations('stats');
  const format = useFormatter();

  const { nickname, battles, winRate, wn8, avgDamage, broneIndex, marks3, trend } = player;
  const tone = ratingTone({ scale: 'wn8', value: wn8 });

  const stats = [
    { key: 'battles', value: format.number(battles) },
    { key: 'winRate', value: `${format.number(winRate, { maximumFractionDigits: 2 })}%` },
    { key: 'avgDamage', value: format.number(avgDamage) },
    { key: 'marks3', value: format.number(marks3) }
  ] as const;

  return (
    <Card isInteractive className={className} padding='none'>
      <Link className={s.root} href={ROUTES.player(nickname)}>
        <div className={s.head}>
          {rank !== undefined && <span className={s.rank}>{String(rank).padStart(2, '0')}</span>}
          <PlayerIdentity player={player} />
          <RatingBadge className={s.badge} label='WN8' size='sm' tone={tone} value={format.number(wn8)} />
        </div>
        <dl className={s.stats}>
          {stats.map((stat) => (
            <div key={stat.key} className={s.stat}>
              <dt>{t(stat.key)}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
        <div className={s.foot}>
          <ProgressBar
            className={s.index}
            label={t('broneIndex')}
            max={BRONYA_INDEX.scale}
            size='sm'
            tone={ratingTone({ scale: 'bronyaIndex', value: broneIndex })}
            value={broneIndex}
            valueLabel={format.number(broneIndex)}
          />
          <Sparkline data={trend} height={32} tone={tone} width={92} />
        </div>
      </Link>
    </Card>
  );
};
