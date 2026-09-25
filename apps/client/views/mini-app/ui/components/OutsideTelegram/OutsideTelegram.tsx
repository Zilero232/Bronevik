'use client';

import { BronevikLogoIcon } from '@bronevik/icons';
import { Globe, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { TELEGRAM_BOT } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { HEAD_REVEAL, STAGGER } from '@/shared/lib';
import { buttonVariants } from '@/ui-kit';

import s from './OutsideTelegram.module.scss';

export const OutsideTelegram = () => {
  const t = useTranslations('tg.outside');

  return (
    <motion.section animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <motion.span aria-hidden className={s.logo} variants={HEAD_REVEAL}>
        <BronevikLogoIcon size={56} strokeWidth={1.4} />
      </motion.span>
      <motion.span className={s.eyebrow} variants={HEAD_REVEAL}>
        {t('eyebrow')}
      </motion.span>
      <motion.h1 className={s.title} variants={HEAD_REVEAL}>
        {t('title')}
      </motion.h1>
      <motion.p className={s.description} variants={HEAD_REVEAL}>
        {t('description', { bot: `@${TELEGRAM_BOT.username}` })}
      </motion.p>
      <motion.div className={s.actions} variants={HEAD_REVEAL}>
        <a className={buttonVariants({ size: 'lg', block: true })} href={TELEGRAM_BOT.url} rel='noreferrer' target='_blank'>
          <Send size={18} />
          {t('open')}
        </a>
        <Link className={buttonVariants({ variant: 'ghost', size: 'lg', block: true })} href={ROUTES.home}>
          <Globe size={18} />
          {t('site')}
        </Link>
      </motion.div>
    </motion.section>
  );
};
