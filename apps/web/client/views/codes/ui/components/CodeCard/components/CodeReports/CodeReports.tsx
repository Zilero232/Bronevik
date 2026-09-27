'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { CodeReportsProps } from './CodeReports.types';

import s from './CodeReports.module.scss';

export const CodeReports = ({ code, isSignedIn, isReporting, loginHref, onReport }: CodeReportsProps) => {
  const t = useTranslations('codes');

  return (
    <div className={s.root}>
      <span className={s.tally}>{t('card.tally', { working: code.workingReports, expired: code.expiredReports })}</span>
      {code.status !== 'expired' &&
        (isSignedIn ? (
          <div className={s.actions}>
            <Button disabled={isReporting} size='sm' variant='secondary' onClick={() => onReport('working')}>
              <ThumbsUp aria-hidden size={14} />
              {t('report.working')}
            </Button>
            <Button disabled={isReporting} size='sm' variant='ghost' onClick={() => onReport('expired')}>
              <ThumbsDown aria-hidden size={14} />
              {t('report.expired')}
            </Button>
          </div>
        ) : (
          <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={loginHref}>
            {t('report.signIn')}
          </Link>
        ))}
    </div>
  );
};
