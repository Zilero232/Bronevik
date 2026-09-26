import { clsx } from 'clsx';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { ratingTone, toneOfTier } from '@/shared/lib';

import type { PlayerCardProps } from './PlayerCard.types';

import { PlayerIdentity } from '../PlayerIdentity';

import s from './PlayerCard.module.scss';

export const PlayerCard = ({ entry, className }: PlayerCardProps) => {
  const t = useTranslations('stats');
  const format = useFormatter();

  const { rank, name, clanTag, value, tier, battles, delta } = entry;

  return (
    <Link className={clsx(s.root, className)} href={ROUTES.players.profile(name)}>
      <span className={s.rank}>{rank}</span>
      <PlayerIdentity className={s.identity} player={{ nickname: name, clanTag }} withAvatar={false} />
      <dl className={s.stats}>
        <div className={s.stat}>
          <dt>WN8</dt>
          <dd className={s.rating} data-tone={tier ? toneOfTier(tier) : ratingTone({ scale: 'wn8', value })}>
            {format.number(value, { maximumFractionDigits: 0 })}
          </dd>
        </div>
        <div className={s.stat}>
          <dt>{t('battles')}</dt>
          <dd>{format.number(battles)}</dd>
        </div>
        {delta !== null && (
          <div className={s.stat}>
            <dt>{t('delta')}</dt>
            <dd>{format.number(delta, { maximumFractionDigits: 0, signDisplay: 'exceptZero' })}</dd>
          </div>
        )}
      </dl>
    </Link>
  );
};
