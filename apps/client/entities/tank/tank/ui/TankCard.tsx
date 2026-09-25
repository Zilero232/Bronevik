import { AnimatedMarkOfExcellence, toRoman } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { ratingTone } from '@/shared/lib';
import { Card, RatingBadge, Sparkline } from '@/ui-kit';

import type { TankCardProps } from './TankCard.types';

import { TankIdentity } from './TankIdentity';
import { TankImage } from './TankImage';

import s from './TankCard.module.scss';

export const TankCard = ({ tank, className }: TankCardProps) => {
  const t = useTranslations('stats');
  const format = useFormatter();

  const { slug, tier, winRate, avgDamage, moe3, trend } = tank;

  return (
    <Card isInteractive className={className} padding='none' variant='riveted'>
      <Link className={s.root} href={ROUTES.tank(slug)}>
        <span className={s.bay}>
          <span aria-hidden className={s.watermark}>
            {toRoman(tier)}
          </span>
          <TankImage isDecorative className={s.render} size='big' tank={tank} />
          <span aria-hidden className={s.ruler} />
        </span>
        <TankIdentity tank={tank} />
        <div className={s.metrics}>
          <div className={s.metric}>
            <span className={s.label}>{t('winRate')}</span>
            <RatingBadge
              size='sm'
              tone={ratingTone({ scale: 'winRate', value: winRate })}
              value={`${format.number(winRate, { maximumFractionDigits: 2 })}%`}
              withPips={false}
            />
          </div>
          <div className={s.metric}>
            <span className={s.label}>{t('avgDamage')}</span>
            <span className={s.value}>{format.number(avgDamage)}</span>
          </div>
        </div>
        <div className={s.foot}>
          <span className={s.moe}>
            <AnimatedMarkOfExcellence marks={3} size={26} strokeWidth={1.6} />
            <span>
              <span className={s.label}>{t('moe3')}</span>
              <span className={s.value}>{format.number(moe3)}</span>
            </span>
          </span>
          <Sparkline data={trend} height={30} tone='steel' width={84} />
        </div>
      </Link>
    </Card>
  );
};
