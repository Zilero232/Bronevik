'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { HEAD_REVEAL, STAGGER } from '@/shared/lib';

import type { LinkHeroProps } from './LinkHero.types';

import { botName } from '../../../lib/bot-link';

import s from './LinkHero.module.scss';

export const LinkHero = ({ status }: LinkHeroProps) => {
  const t = useTranslations('telegram.hero');

  const isLinked = status?.isLinked ?? false;
  const readouts = [
    { key: 'channel', label: t('channel'), value: isLinked ? t('online') : t('offline'), isLive: isLinked },
    { key: 'account', label: t('account'), value: status?.username ? `@${status.username}` : '—', isLive: false },
    { key: 'bot', label: t('bot'), value: `@${botName(status?.botUsername)}`, isLive: false }
  ];

  return (
    <motion.header animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <motion.span className={s.eyebrow} variants={HEAD_REVEAL}>
        {t('eyebrow')}
      </motion.span>
      <motion.h1 className={s.title} variants={HEAD_REVEAL}>
        {t.rich('title', { hot: (chunks) => <span className={s.hot}>{chunks}</span> })}
      </motion.h1>
      <motion.p className={s.lead} variants={HEAD_REVEAL}>
        {t('lead')}
      </motion.p>
      <motion.dl className={s.readouts} variants={HEAD_REVEAL}>
        {readouts.map(({ key, label, value, isLive }) => (
          <div key={key} className={s.readout} data-live={isLive}>
            <dt className={s.label}>{label}</dt>
            <dd className={s.value}>{value}</dd>
          </div>
        ))}
      </motion.dl>
    </motion.header>
  );
};
