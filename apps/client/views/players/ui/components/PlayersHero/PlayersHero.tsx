'use client';

import { ArrowLeftRight, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { EntityPicker } from '@/features/search/pick-entity';
import { ROUTES } from '@/shared/constants';
import { Link, useRouter } from '@/shared/i18n/navigation';
import { HEAD_REVEAL, STAGGER } from '@/shared/lib';

import s from './PlayersHero.module.scss';

export const PlayersHero = () => {
  const router = useRouter();

  const t = useTranslations('players.hero');

  return (
    <section className={s.root}>
      <div aria-hidden className={s.backdrop}>
        <span className={s.ring} />
        <span className={s.ring} />
        <span className={s.sweep} />
      </div>
      <motion.div animate='visible' className={s.inner} initial='hidden' variants={STAGGER}>
        <motion.span className={s.eyebrow} variants={HEAD_REVEAL}>
          {t('eyebrow')}
        </motion.span>
        <motion.h1 className={s.title} variants={HEAD_REVEAL}>
          {t.rich('title', { hot: (chunks) => <span className={s.hot}>{chunks}</span> })}
        </motion.h1>
        <motion.p className={s.lead} variants={HEAD_REVEAL}>
          {t('lead')}
        </motion.p>
        <motion.div className={s.search} variants={HEAD_REVEAL}>
          <EntityPicker kind='player' placeholder={t('placeholder')} size='lg' onPick={({ nickname }) => router.push(ROUTES.player(nickname))} />
        </motion.div>
        <motion.div className={s.links} variants={HEAD_REVEAL}>
          <Link className={s.link} href={ROUTES.comparePlayers}>
            <ArrowLeftRight size={15} />
            {t('compare')}
          </Link>
          <Link className={s.link} href={ROUTES.top}>
            <Trophy size={15} />
            {t('top')}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};
