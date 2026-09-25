'use client';

import { RefreshCw, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { SCALE_IN } from '@/shared/lib';
import { Button, buttonVariants, CopyField, ProgressBar } from '@/ui-kit';

import type { CodeTicketProps } from './CodeTicket.types';

import { TELEGRAM_LINK } from '../../../config';
import { botLink } from '../../../lib/bot-link';
import { useCountdown } from '../../../model/hooks';

import s from './CodeTicket.module.scss';

export const CodeTicket = ({ code, botUsername, issuedAt, isIssuing, onReissue }: CodeTicketProps) => {
  const t = useTranslations('telegram.ticket');
  const { label, ratio, isExpired } = useCountdown({ expiresAt: code.expiresAt, issuedAt });

  const deepLink = code.deepLink ?? botLink({ username: botUsername, start: code.code });

  return (
    <motion.div animate='visible' className={s.root} data-expired={isExpired} initial='hidden' variants={SCALE_IN}>
      <div className={s.tape}>
        <span className={s.tapeLabel}>{t('label')}</span>
        <output aria-live='polite' className={s.code}>
          {code.code}
        </output>
      </div>
      <div className={s.fuse}>
        <ProgressBar
          label={isExpired ? t('expired') : t('expires')}
          size='sm'
          tone={isExpired ? 'bad' : 'accent'}
          value={ratio * 100}
          valueLabel={label}
        />
      </div>
      <div className={s.actions}>
        {isExpired ? (
          <Button block disabled={isIssuing} size='lg' onClick={onReissue}>
            <RefreshCw size={18} />
            {t('reissue')}
          </Button>
        ) : (
          <a className={buttonVariants({ size: 'lg', block: true })} href={deepLink} rel='noreferrer' target='_blank'>
            <Send size={18} />
            {t('openBot')}
          </a>
        )}
      </div>
      {!isExpired && (
        <div className={s.fallback}>
          <CopyField label={t('fallback')} tone='accent' value={`${TELEGRAM_LINK.startCommand} ${code.code}`} />
          <Button disabled={isIssuing} size='sm' variant='ghost' onClick={onReissue}>
            <RefreshCw size={14} />
            {t('another')}
          </Button>
        </div>
      )}
    </motion.div>
  );
};
