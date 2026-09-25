'use client';

import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { LiveLamp } from '@/entities/streamer/broadcast';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { HEAD_REVEAL, STAGGER } from '@/shared/lib';
import { buttonVariants } from '@/ui-kit';

import { useStreamerProfile } from '../../../model/hooks';

import s from './StudioHeader.module.scss';

export const StudioHeader = () => {
  const t = useTranslations('streamer.studio');
  const { data: profile } = useStreamerProfile();

  return (
    <motion.header animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <motion.div className={s.frame} variants={HEAD_REVEAL}>
        <LiveLamp isLive={Boolean(profile?.isLive)} label={profile?.isLive ? t('onAir') : t('offAir')} size='sm' />
        <span className={s.eyebrow}>{t('eyebrow')}</span>
      </motion.div>
      <div className={s.body}>
        <div className={s.text}>
          <motion.h1 className={s.title} variants={HEAD_REVEAL}>
            {t('title')}
          </motion.h1>
          <motion.p className={s.lead} variants={HEAD_REVEAL}>
            {t('lead')}
          </motion.p>
        </div>
        {profile && (
          <motion.div variants={HEAD_REVEAL}>
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.streamer(profile.slug)}>
              <ExternalLink size={14} />
              {t('openPublic')}
            </Link>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};
