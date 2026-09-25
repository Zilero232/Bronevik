'use client';

import { API_PLAN_LIMITS } from '@bronevik/schemas';
import { BookOpen, KeyRound } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { DEVELOPER_PATHS } from '@/shared/api/developer';
import { env } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { HEAD_REVEAL, SLIDE_UP, STAGGER } from '@/shared/lib';
import { buttonVariants } from '@/ui-kit';

import { trimBaseUrl } from '../../../lib/curl-example';
import { TelemetryConsole } from './components';

import s from './DevelopersHero.module.scss';

export const DevelopersHero = () => {
  const t = useTranslations('developers.hero');
  const format = useFormatter();

  const { requestsPerDay, requestsPerSecond } = API_PLAN_LIMITS.free;
  const readouts = [
    { key: 'free', value: format.number(requestsPerDay, { notation: 'compact' }), label: t('readouts.perDay') },
    { key: 'rps', value: format.number(requestsPerSecond), label: t('readouts.perSecond') },
    { key: 'version', value: 'v1', label: t('readouts.version') }
  ];

  return (
    <section className={s.root}>
      <div aria-hidden className={s.backdrop} />
      <div className={s.inner}>
        <motion.div animate='visible' className={s.copy} initial='hidden' variants={STAGGER}>
          <motion.span className={s.eyebrow} variants={HEAD_REVEAL}>
            <span className={s.live} />
            {t('eyebrow')}
          </motion.span>
          <motion.h1 className={s.title} variants={HEAD_REVEAL}>
            {t.rich('title', { hot: (chunks) => <span className={s.hot}>{chunks}</span> })}
          </motion.h1>
          <motion.p className={s.lead} variants={HEAD_REVEAL}>
            {t('lead')}
          </motion.p>
          <motion.div className={s.actions} variants={SLIDE_UP}>
            <Link className={buttonVariants({ variant: 'primary', size: 'lg' })} href={ROUTES.account.developer}>
              <KeyRound size={17} />
              {t('getKey')}
            </Link>
            <a
              className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              href={`${trimBaseUrl(env.NEXT_PUBLIC_API_URL)}${DEVELOPER_PATHS.docs}`}
              rel='noreferrer'
              target='_blank'
            >
              <BookOpen size={17} />
              {t('docs')}
            </a>
          </motion.div>
          <motion.dl className={s.readouts} variants={HEAD_REVEAL}>
            {readouts.map(({ key, value, label }) => (
              <div key={key} className={s.readout}>
                <dt className={s.readoutLabel}>{label}</dt>
                <dd className={s.readoutValue}>{value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
        <motion.div animate='visible' className={s.console} initial='hidden' variants={SLIDE_UP}>
          <TelemetryConsole />
        </motion.div>
      </div>
    </section>
  );
};
