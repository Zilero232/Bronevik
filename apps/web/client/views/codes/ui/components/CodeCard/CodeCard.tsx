'use client';

import { Check, Copy, Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, Button } from '@/ui-kit';

import type { CodeCardProps } from './CodeCard.types';

import { CODES } from '../../../config';
import { useCodeCard } from '../../../model/hooks';
import { CodeMeta, CodeReports } from './components';

import s from './CodeCard.module.scss';

export const CodeCard = ({ code }: CodeCardProps) => {
  const t = useTranslations('codes');
  const { sourceHref, ribbon, copied, loginHref, onCopy, isSignedIn, isReporting, report } = useCodeCard({ code });

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
      <CodeMeta code={code} sourceHref={sourceHref} />
      <CodeReports code={code} isReporting={isReporting} isSignedIn={isSignedIn} loginHref={loginHref} onReport={report} />
    </li>
  );
};
