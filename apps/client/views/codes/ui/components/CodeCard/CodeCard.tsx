'use client';

import { Check, Copy, ExternalLink, Gift, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { useLoginHref } from '@/entities/auth/session';
import { Link } from '@/shared/i18n/navigation';
import { Badge, Button, buttonVariants, RelativeTime } from '@/ui-kit';

import type { CodeCardProps } from './CodeCard.types';

import { CODES } from '../../../config';
import { useCodeCard } from '../../../model/hooks';

import s from './CodeCard.module.scss';

export const CodeCard = ({ code }: CodeCardProps) => {
  const loginHref = useLoginHref();
  const t = useTranslations('codes');
  const format = useFormatter();
  const { sourceHref, ribbon, copied, onCopy, isSignedIn, isReporting, report } = useCodeCard({ code });

  return (
    <li className={s.root} data-status={code.status}>
      {ribbon && (
        <Badge shape='corner' tone={ribbon.kind === 'new' ? 'steel' : 'accent'}>
          {ribbon.kind === 'expiring' ? t('ribbon.expiring', { days: ribbon.days }) : t('ribbon.new')}
        </Badge>
      )}
      <div className={s.ticket}>
        <div aria-hidden className={s.stub}>
          <Gift size={22} />
        </div>
        <div className={s.main}>
          <div className={s.head}>
            <p className={s.title}>{code.title ?? t('card.noTitle')}</p>
            <Badge tone={CODES.statusTone[code.status]}>{t(`status.${code.status}`)}</Badge>
          </div>
          <div className={s.codeRow}>
            <code className={s.code}>{code.code}</code>
            <Button className={s.copy} size='sm' variant='primary' onClick={onCopy}>
              {copied ? <Check aria-hidden size={14} /> : <Copy aria-hidden size={14} />}
              {copied ? t('card.copied') : t('card.copy')}
            </Button>
          </div>
          {code.rewards.length > 0 && (
            <ul aria-label={t('card.rewards')} className={s.rewards}>
              {code.rewards.map((reward) => (
                <li key={reward} className={s.reward}>
                  <Gift aria-hidden className={s.rewardIcon} size={14} />
                  {reward}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <dl className={s.meta}>
        <div className={s.row}>
          <dt>{t('card.source')}</dt>
          <dd>
            {sourceHref ? (
              <a className={s.source} href={sourceHref} rel='noopener noreferrer' target='_blank'>
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
            <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={loginHref}>
              {t('report.signIn')}
            </Link>
          ))}
      </div>
    </li>
  );
};
