'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { CommandPaletteTrigger } from '@/features/search/command-palette';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { HEAD_REVEAL, STAGGER } from '@/shared/lib';
import { MOCK_TANKS } from '@/shared/mocks';

import { HeroScope } from '../HeroScope';
import { HERO_TRACERS } from './HomeHero.constants';

import s from './HomeHero.module.scss';

const POPULAR = MOCK_TANKS.slice(0, 5);

export const HomeHero = () => {
  const t = useTranslations('home.hero');

  return (
    <section className={s.root}>
      <div aria-hidden className={s.backdrop}>
        {HERO_TRACERS.map((tracer) => (
          <span key={tracer.top} className={s.tracer} style={{ top: tracer.top, animationDelay: tracer.delay, animationDuration: tracer.duration }} />
        ))}
      </div>
      <div className={s.inner}>
        <motion.div animate='visible' className={s.copy} initial='hidden' variants={STAGGER}>
          <motion.span className={s.eyebrow} variants={HEAD_REVEAL}>
            <span className={s.live} />
            {t('eyebrow')}
          </motion.span>
          <motion.h1 className={s.title} variants={HEAD_REVEAL}>
            {t.rich('title', {
              hot: (chunks) => <span className={s.hot}>{chunks}</span>,
              line: (chunks) => <span className={s.line}>{chunks}</span>
            })}
          </motion.h1>
          <motion.p className={s.lead} variants={HEAD_REVEAL}>
            {t('lead')}
          </motion.p>
          <motion.div className={s.search} variants={HEAD_REVEAL}>
            <CommandPaletteTrigger variant='hero' />
          </motion.div>
          <motion.div className={s.chips} variants={HEAD_REVEAL}>
            <span className={s.chipsLabel}>{t('popular')}</span>
            {POPULAR.map((tank) => (
              <Link key={tank.slug} className={s.chip} href={ROUTES.tank(tank.slug)}>
                {tank.name}
              </Link>
            ))}
          </motion.div>
        </motion.div>
        <HeroScope />
      </div>
    </section>
  );
};
