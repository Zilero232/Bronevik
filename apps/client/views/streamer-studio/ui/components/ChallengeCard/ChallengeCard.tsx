'use client';

import { useFormatter, useNow, useTranslations } from 'next-intl';

import { Badge, ProgressBar } from '@/ui-kit';

import type { ChallengeCardProps } from './ChallengeCard.types';

import { CHALLENGE_NOW_REFRESH_MS, CHALLENGE_STATUS_TONE } from '../../../config';
import { ChallengeActions } from '../ChallengeActions';
import { ChallengeCode } from '../ChallengeCode';
import { ConditionSentenceText } from '../ConditionSentenceText';

import s from './ChallengeCard.module.scss';

export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const t = useTranslations('streamer.challenges');
  const format = useFormatter();
  const now = useNow({ updateInterval: CHALLENGE_NOW_REFRESH_MS });
  const { id, title, code, status, amount, currency, condition, progress, donorName, expiresAt } = challenge;

  return (
    <article className={s.root} data-status={status}>
      <header className={s.head}>
        <ChallengeCode code={code} />
        <div className={s.badges}>
          <Badge tone={CHALLENGE_STATUS_TONE[status]}>{t(`status.${status}`)}</Badge>
          <span className={s.amount}>{format.number(amount, { style: 'currency', currency, maximumFractionDigits: 0 })}</span>
        </div>
      </header>
      <h4 className={s.title}>{title}</h4>
      <ConditionSentenceText condition={condition} />
      {progress && (
        <ProgressBar
          label={t('list.progress')}
          max={Math.max(condition.value, 1)}
          size='sm'
          value={Math.min(progress.value, condition.value)}
          valueLabel={t('list.battles', { done: progress.battles, total: condition.battles })}
        />
      )}
      <footer className={s.foot}>
        <dl className={s.meta}>
          {donorName && (
            <div className={s.metaItem}>
              <dt>{t('list.donor')}</dt>
              <dd>{donorName}</dd>
            </div>
          )}
          {expiresAt && (
            <div className={s.metaItem}>
              <dt>{t('list.expires')}</dt>
              <dd>{format.relativeTime(new Date(expiresAt), now)}</dd>
            </div>
          )}
        </dl>
        <ChallengeActions id={id} status={status} />
      </footer>
    </article>
  );
};
