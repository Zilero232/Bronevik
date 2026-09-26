'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { buildHref, popularLoadout } from '@/entities/tank/build';
import { Link } from '@/shared/i18n/navigation';
import { PERCENT_TEXT, percentText, ratingTone } from '@/shared/lib';

import type { BuildCardProps } from './BuildCard.types';

import { useTank } from '../../../../../model/context';
import { BuildLoadout } from '../BuildLoadout';

import s from './BuildCard.module.scss';

export const BuildCard = ({ build, source, rank }: BuildCardProps) => {
  const t = useTranslations('tank.builds');
  const format = useFormatter();
  const { slug } = useTank();

  const { share, winRate, avgDamage, battles } = build;

  return (
    <article className={s.root}>
      <header className={s.head}>
        <span className={s.rank}>{`#${rank}`}</span>
        <span className={s.source} title={t(`sourceHint.${source}`)}>
          {t(`source.${source}`)}
        </span>
      </header>
      <div className={s.share}>
        <span className={s.shareValue}>{format.number(share, { style: 'percent', maximumFractionDigits: 1 })}</span>
        <span className={s.label}>{t('share')}</span>
        <span aria-hidden className={s.track}>
          <span className={s.fill} style={{ width: `${Math.min(share, 1) * 100}%` }} />
        </span>
      </div>
      <dl className={s.stats}>
        <div>
          <dt className={s.label}>{t('winRate')}</dt>
          <dd className={s.rated} data-tone={winRate === null ? undefined : ratingTone({ scale: 'winRate', value: winRate })}>
            {winRate === null ? PERCENT_TEXT.empty : percentText({ format, value: winRate })}
          </dd>
        </div>
        <div>
          <dt className={s.label}>{t('avgDamage')}</dt>
          <dd>{avgDamage === null ? PERCENT_TEXT.empty : format.number(avgDamage, { maximumFractionDigits: 0 })}</dd>
        </div>
        <div>
          <dt className={s.label}>{t('battles')}</dt>
          <dd>{format.number(battles, { notation: 'compact', maximumFractionDigits: 1 })}</dd>
        </div>
      </dl>
      <BuildLoadout build={build} />
      <Link className={s.open} href={buildHref({ slug, loadout: popularLoadout(build) })}>
        {t('open')}
      </Link>
    </article>
  );
};
