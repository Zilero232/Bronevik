'use client';

import { Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { TELEGRAM_BOT } from '@/shared/config';
import { REVEAL_VIEWPORT, SCALE_IN } from '@/shared/lib';
import { buttonVariants, SectionHeader } from '@/ui-kit';

import s from './Showcase.module.scss';

const SLOTS = ['bot', 'overlay', 'tracker'] as const;

export const Showcase = () => {
  const t = useTranslations('developers.showcase');

  return (
    <section className={s.root} id='showcase'>
      <SectionHeader eyebrow={t('eyebrow')} index='05' title={t('title')} />
      <motion.div className={s.hangar} initial='hidden' variants={SCALE_IN} viewport={REVEAL_VIEWPORT} whileInView='visible'>
        <ul aria-hidden className={s.slots}>
          {SLOTS.map((slot) => (
            <li key={slot} className={s.slot}>
              <span className={s.slotLabel}>{t(`slots.${slot}`)}</span>
            </li>
          ))}
        </ul>
        <div className={s.copy}>
          <span className={s.stamp}>{t('badge')}</span>
          <p className={s.text}>{t('text')}</p>
          <a className={buttonVariants({ variant: 'primary' })} href={TELEGRAM_BOT.url} rel='noreferrer' target='_blank'>
            <Send size={16} />
            {t('cta')}
          </a>
        </div>
      </motion.div>
    </section>
  );
};
