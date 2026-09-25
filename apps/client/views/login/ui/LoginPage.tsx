'use client';

import { BronevikLogoIcon } from '@bronevik/icons';
import { Check, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { HEAD_REVEAL, STAGGER } from '@/shared/lib';

import { LOGIN } from '../config';
import { LoginOptions } from './components';

import s from './LoginPage.module.scss';

export const LoginPage = () => {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();

  const error = searchParams.get('error');

  return (
    <div className={s.root}>
      <motion.aside animate='visible' className={s.brand} initial='hidden' variants={STAGGER}>
        <motion.span className={s.logo} variants={HEAD_REVEAL}>
          <BronevikLogoIcon size={56} strokeWidth={1.4} />
        </motion.span>
        <motion.h1 className={s.title} variants={HEAD_REVEAL}>
          {t.rich('title', { hot: (chunks) => <span className={s.hot}>{chunks}</span> })}
        </motion.h1>
        <motion.p className={s.lead} variants={HEAD_REVEAL}>
          {t('lead')}
        </motion.p>
        <motion.ul className={s.perks} variants={HEAD_REVEAL}>
          {LOGIN.perks.map((perk) => (
            <li key={perk}>
              <Check size={16} />
              {t(`perks.${perk}`)}
            </li>
          ))}
        </motion.ul>
        <motion.p className={s.safety} variants={HEAD_REVEAL}>
          <ShieldAlert size={16} />
          {t('safety')}
        </motion.p>
      </motion.aside>
      <LoginOptions error={error} />
    </div>
  );
};
