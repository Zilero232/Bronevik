'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { HEAD_REVEAL, STAGGER } from '@/shared/lib';

import { PHASE_VIEW, WEB_LOGIN } from '../config';
import { useWebLogin } from '../model/hooks';
import { LoginActions } from './components';

import s from './TelegramLoginPage.module.scss';

export const TelegramLoginPage = () => {
  const t = useTranslations('telegram.webLogin');
  const phase = useWebLogin();

  const { icon: Icon, tone } = PHASE_VIEW[phase];

  return (
    <div className={s.root}>
      <motion.section key={phase} animate='visible' aria-live='polite' className={s.panel} data-tone={tone} initial='hidden' variants={STAGGER}>
        <motion.span className={s.icon} data-spin={phase === 'redeeming'} variants={HEAD_REVEAL}>
          <Icon size={32} strokeWidth={1.5} />
        </motion.span>
        <motion.span className={s.eyebrow} variants={HEAD_REVEAL}>
          {t('eyebrow')}
        </motion.span>
        <motion.h1 className={s.title} variants={HEAD_REVEAL}>
          {t(`phases.${phase}.title`)}
        </motion.h1>
        <motion.p className={s.description} variants={HEAD_REVEAL}>
          {t(`phases.${phase}.description`, { command: WEB_LOGIN.botCommand })}
        </motion.p>
        <motion.div variants={HEAD_REVEAL}>
          <LoginActions phase={phase} />
        </motion.div>
      </motion.section>
    </div>
  );
};
