'use client';

import { CalendarDays, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { HEAD_REVEAL, STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { ProgressRing } from '@/ui-kit';

import type { ClanHeroProps } from './ClanHero.types';

import { HeroStats } from './components';

import s from './ClanHero.module.scss';

export const ClanHero = ({ page }: ClanHeroProps) => {
  const t = useTranslations('clans.clan');
  const format = useFormatter();

  const { clan, stats } = page;
  const { clanId, tag, name, motto, membersCount, createdAt } = clan;
  const active = stats.activeMembers7d ?? 0;
  const total = Math.max(membersCount, 1);

  return (
    <motion.header animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <span aria-hidden className={s.watermark}>
        {tag}
      </span>
      <span aria-hidden className={s.scan} />
      <div className={s.inner}>
        <div className={s.identity}>
          <motion.span className={s.eyebrow} variants={STAGGER_ITEM}>
            {t('eyebrow', { id: clanId })}
          </motion.span>
          <motion.h1 className={s.title} variants={HEAD_REVEAL}>
            <span className={s.tag}>[{tag}]</span>
            <span className={s.name}>{name}</span>
          </motion.h1>
          {motto && (
            <motion.p className={s.motto} variants={STAGGER_ITEM}>
              {t('motto', { motto })}
            </motion.p>
          )}
          <motion.ul className={s.meta} variants={STAGGER_ITEM}>
            {createdAt && (
              <li>
                <CalendarDays aria-hidden size={14} />
                {t('founded', { date: format.dateTime(new Date(createdAt), { dateStyle: 'long' }) })}
              </li>
            )}
            <li>
              <Users aria-hidden size={14} />
              {t('members', { count: membersCount })}
            </li>
          </motion.ul>
        </div>
        <motion.div className={s.ring} variants={STAGGER_ITEM}>
          <ProgressRing label={t('activeLabel')} max={total} size={168} thickness={8} value={active}>
            <span className={s.ringValue}>{format.number(active / total, { style: 'percent' })}</span>
            <span className={s.ringLabel}>{t('activeShort', { active, total: membersCount })}</span>
          </ProgressRing>
        </motion.div>
      </div>
      <HeroStats stats={stats} />
    </motion.header>
  );
};
