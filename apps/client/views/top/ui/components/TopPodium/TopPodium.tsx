'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { SCALE_IN, STAGGER } from '@/shared/lib';

import type { TopPodiumProps } from './TopPodium.types';

import { EntryValue } from '../EntryValue';

import s from './TopPodium.module.scss';

export const TopPodium = ({ entries, filter }: TopPodiumProps) => {
  const t = useTranslations('top');

  return (
    <motion.ol animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      {entries.map((entry) => {
        const { rank, name, clanTag, battles, accountId, color } = entry;
        const href = accountId === null ? ROUTES.clan(clanTag ?? name) : ROUTES.player(name);

        return (
          <motion.li key={`${rank}-${name}`} className={s.place} data-rank={rank} variants={SCALE_IN}>
            <Link className={s.card} href={href}>
              <span aria-hidden className={s.rank}>
                {String(rank).padStart(2, '0')}
              </span>
              <span className={s.name}>
                {color && <span aria-hidden className={s.swatch} style={{ '--clan-color': color }} />}
                {accountId === null ? `[${clanTag}]` : name}
              </span>
              <span className={s.sub}>{accountId === null ? name : clanTag ? `[${clanTag}]` : t('noClan')}</span>
              <EntryValue entry={entry} filter={filter} size='lg' />
              <span className={s.battles}>{t('battles', { count: battles })}</span>
            </Link>
          </motion.li>
        );
      })}
    </motion.ol>
  );
};
