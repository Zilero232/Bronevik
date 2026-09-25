'use client';

import { CheckCheck, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { SCALE_IN } from '@/shared/lib';
import { Burst, buttonVariants } from '@/ui-kit';

import type { LinkedPanelProps } from './LinkedPanel.types';

import { botLink } from '../../../lib/bot-link';
import { BotCommands } from '../BotCommands';
import { UnlinkDialog } from '../UnlinkDialog';

import s from './LinkedPanel.module.scss';

export const LinkedPanel = ({ username, botUsername, bursts }: LinkedPanelProps) => {
  const t = useTranslations('telegram.linked');

  return (
    <section className={s.root}>
      <motion.header animate='visible' className={s.header} initial='hidden' variants={SCALE_IN}>
        <Burst className={s.seal} trigger={bursts}>
          <CheckCheck size={28} />
        </Burst>
        <div className={s.identity}>
          <span className={s.eyebrow}>{t('eyebrow')}</span>
          <strong className={s.username}>{username ? `@${username}` : t('anonymous')}</strong>
          <p className={s.description}>{t('description')}</p>
        </div>
        <div className={s.actions}>
          <a className={buttonVariants({ variant: 'secondary' })} href={botLink({ username: botUsername })} rel='noreferrer' target='_blank'>
            <Send size={16} />
            {t('openBot')}
          </a>
          <UnlinkDialog />
        </div>
      </motion.header>
      <BotCommands botUsername={botUsername} />
    </section>
  );
};
