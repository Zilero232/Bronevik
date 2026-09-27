'use client';

import { ExternalLink, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, buttonVariants, CopyField, ProgressBar } from '@/ui-kit';

import type { CodeTicketProps } from './CodeTicket.types';

import { TELEGRAM_LINK } from '../../../config';
import { codeDeepLink } from '../../../lib/bot-link';
import { useCodeCountdown } from '../../../model/hooks';

import s from './CodeTicket.module.scss';

export const CodeTicket = ({ code, botUsername, issuedAt, isIssuing, onReissue }: CodeTicketProps) => {
  const t = useTranslations('telegram.ticket');
  const { label, ratio, isExpired } = useCodeCountdown({ expiresAt: code.expiresAt, issuedAt });

  return (
    <div className={s.root} data-expired={isExpired}>
      <div className={s.code}>
        <span className={s.codeLabel}>{t('label')}</span>
        <output aria-live='polite' className={s.value}>
          {code.code}
        </output>
      </div>
      <ProgressBar
        label={isExpired ? t('expired') : t('expires')}
        size='sm'
        tone={isExpired ? 'bad' : 'accent'}
        value={ratio * 100}
        valueLabel={label}
      />
      {isExpired ? (
        <Button block disabled={isIssuing} size='lg' onClick={onReissue}>
          <RefreshCw size={16} />
          {t('reissue')}
        </Button>
      ) : (
        <>
          <a className={buttonVariants({ size: 'lg', block: true })} href={codeDeepLink({ code, botUsername })} rel='noreferrer' target='_blank'>
            {t('openBot')}
            <ExternalLink size={14} />
          </a>
          <div className={s.fallback}>
            <CopyField label={t('fallback')} value={`${TELEGRAM_LINK.startCommand} ${code.code}`} />
            <Button disabled={isIssuing} size='sm' variant='ghost' onClick={onReissue}>
              <RefreshCw size={14} />
              {t('another')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
