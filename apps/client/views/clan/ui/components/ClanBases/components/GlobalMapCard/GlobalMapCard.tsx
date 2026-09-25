'use client';

import { GlobalMapIcon } from '@bronevik/icons';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';
import { sumBy } from 'remeda';

import { EASE_OUT, REVEAL_VIEWPORT } from '@/shared/lib';

import type { GlobalMapCardProps } from './GlobalMapCard.types';

import s from './GlobalMapCard.module.scss';

const ELO_TIERS = [10, 8, 6] as const;

export const GlobalMapCard = ({ globalMap }: GlobalMapCardProps) => {
  const t = useTranslations('clans.bases.globalMap');
  const format = useFormatter();

  const { provincesCount, provinces, eloRating6, eloRating8, eloRating10 } = globalMap;
  const elo = { 10: eloRating10, 8: eloRating8, 6: eloRating6 };
  const peak = Math.max(1, ...Object.values(elo).map((value) => value ?? 0));
  const revenue = sumBy(provinces, (province) => province.dailyRevenue ?? 0);

  return (
    <article className={s.root}>
      <header className={s.head}>
        <GlobalMapIcon aria-hidden className={s.icon} size={40} />
        <div>
          <span className={s.eyebrow}>{t('eyebrow')}</span>
          <h3 className={s.title}>{t('provinces', { count: provincesCount })}</h3>
        </div>
      </header>
      <dl className={s.summary}>
        <div>
          <dt>{t('provincesLabel')}</dt>
          <dd>{format.number(provincesCount)}</dd>
        </div>
        <div>
          <dt>{t('dailyRevenue')}</dt>
          <dd>{provinces.length > 0 ? format.number(revenue) : '—'}</dd>
        </div>
      </dl>
      <h4 className={s.subtitle}>{t('eloTitle')}</h4>
      <ul className={s.elo}>
        {ELO_TIERS.map((tier, index) => (
          <li key={tier} className={s.gauge}>
            <span className={s.tier}>{t('tier', { tier })}</span>
            <span className={s.track}>
              <motion.span
                className={s.fill}
                initial={{ scaleX: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: index * 0.1 }}
                viewport={REVEAL_VIEWPORT}
                whileInView={{ scaleX: (elo[tier] ?? 0) / peak }}
              />
            </span>
            <span className={s.value}>{elo[tier] === null ? '—' : format.number(elo[tier])}</span>
          </li>
        ))}
      </ul>
      <h4 className={s.subtitle}>{t('provincesTitle')}</h4>
      {provinces.length > 0 ? (
        <ul className={s.provinces}>
          {provinces.map(({ provinceId, name, dailyRevenue }) => (
            <li key={provinceId} className={s.province}>
              <span className={s.provinceName}>{name}</span>
              <span className={s.revenue}>{dailyRevenue === null ? '—' : format.number(dailyRevenue)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.note}>{t('noProvinces')}</p>
      )}
    </article>
  );
};
