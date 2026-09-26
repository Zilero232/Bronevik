'use client';

import { ExternalLink, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, Button, buttonVariants, CopyField, RelativeTime } from '@/ui-kit';

import type { CodeCardProps } from './CodeCard.types';

import { CODES } from '../../../config';
import { useCodeReport } from '../../../model/hooks';

import s from './CodeCard.module.scss';

export const CodeCard = ({ code }: CodeCardProps) => {
  const t = useTranslations('codes');
  const format = useFormatter();
  const { isSignedIn, isReporting, report } = useCodeReport({ code: code.code });

  return (
    <li className={s.root} data-status={code.status}>
      <div className={s.head}>
        <CopyField className={s.code} tone={code.status === 'expired' ? 'neutral' : 'accent'} value={code.code} />
        <Badge tone={CODES.statusTone[code.status]}>{t(`status.${code.status}`)}</Badge>
      </div>
      <p className={s.title}>{code.title ?? t('card.noTitle')}</p>
      {code.rewards.length > 0 && (
        <ul aria-label={t('card.rewards')} className={s.rewards}>
          {code.rewards.map((reward) => (
            <li key={reward}>
              <Badge tone='steel'>{reward}</Badge>
            </li>
          ))}
        </ul>
      )}
      <dl className={s.meta}>
        <div className={s.row}>
          <dt>{t('card.source')}</dt>
          <dd>
            {code.sourceUrl ? (
              <a className={s.source} href={code.sourceUrl} rel='noreferrer' target='_blank'>
                {code.source}
                <ExternalLink aria-hidden size={12} />
              </a>
            ) : (
              code.source
            )}
          </dd>
        </div>
        <div className={s.row}>
          <dt>{t('card.expires')}</dt>
          <dd>{code.expiresAt ? format.dateTime(new Date(code.expiresAt), { dateStyle: 'medium' }) : t('card.noExpiry')}</dd>
        </div>
        <div className={s.row}>
          <dt>{t('card.discovered')}</dt>
          <dd>
            <RelativeTime value={code.discoveredAt} />
          </dd>
        </div>
      </dl>
      <div className={s.reports}>
        <span className={s.tally}>{t('card.tally', { working: code.workingReports, expired: code.expiredReports })}</span>
        {code.status !== 'expired' &&
          (isSignedIn ? (
            <div className={s.actions}>
              <Button disabled={isReporting} size='sm' variant='secondary' onClick={() => report('working')}>
                <ThumbsUp aria-hidden size={14} />
                {t('report.working')}
              </Button>
              <Button disabled={isReporting} size='sm' variant='ghost' onClick={() => report('expired')}>
                <ThumbsDown aria-hidden size={14} />
                {t('report.expired')}
              </Button>
            </div>
          ) : (
            <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={ROUTES.login}>
              {t('report.signIn')}
            </Link>
          ))}
      </div>
    </li>
  );
};
