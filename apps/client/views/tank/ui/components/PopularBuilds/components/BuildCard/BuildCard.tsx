'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { buildHref, popularLoadout } from '@/entities/tank/build';
import { Link } from '@/shared/i18n/navigation';
import { PERCENT_TEXT, percentText, ratingTone, REVEAL_VIEWPORT } from '@/shared/lib';
import { Badge, RatingBadge } from '@/ui-kit';

import type { BuildCardProps } from './BuildCard.types';

import { useTank } from '../../../../../model/context';
import { BuildLoadout } from '../BuildLoadout';
import { SHARE_TRANSITION } from './BuildCard.motion';

import s from './BuildCard.module.scss';

export const BuildCard = ({ build, source, rank }: BuildCardProps) => {
  const t = useTranslations('tank.builds');
  const format = useFormatter();
  const { slug } = useTank();

  const { share, winRate, avgDamage, battles } = build;

  return (
    <article className={s.root} data-source={source}>
      <header className={s.head}>
        <span className={s.rank}>{`#${rank}`}</span>
        <Badge title={t(`sourceHint.${source}`)} tone={source === 'battles' ? 'accent' : 'steel'}>
          {t(`source.${source}`)}
        </Badge>
      </header>
      <div className={s.share}>
        <span className={s.shareValue}>{format.number(share, { style: 'percent', maximumFractionDigits: 1 })}</span>
        <span className={s.shareLabel}>{t('share')}</span>
        <span aria-hidden className={s.track}>
          <motion.span
            className={s.fill}
            initial={{ scaleX: 0 }}
            transition={SHARE_TRANSITION}
            viewport={REVEAL_VIEWPORT}
            whileInView={{ scaleX: Math.min(share, 1) }}
          />
        </span>
      </div>
      <dl className={s.stats}>
        <div>
          <dt>{t('winRate')}</dt>
          <dd>
            {winRate === null ? (
              PERCENT_TEXT.empty
            ) : (
              <RatingBadge size='sm' tone={ratingTone({ scale: 'winRate', value: winRate })} value={percentText({ format, value: winRate })} />
            )}
          </dd>
        </div>
        <div>
          <dt>{t('avgDamage')}</dt>
          <dd>{avgDamage === null ? PERCENT_TEXT.empty : format.number(avgDamage, { maximumFractionDigits: 0 })}</dd>
        </div>
        <div>
          <dt>{t('battles')}</dt>
          <dd>{format.number(battles, { notation: 'compact', maximumFractionDigits: 1 })}</dd>
        </div>
      </dl>
      <BuildLoadout build={build} />
      <Link className={s.open} href={buildHref({ slug, loadout: popularLoadout(build) })}>
        {t('open')}
        <ArrowUpRight aria-hidden size={16} />
      </Link>
    </article>
  );
};
