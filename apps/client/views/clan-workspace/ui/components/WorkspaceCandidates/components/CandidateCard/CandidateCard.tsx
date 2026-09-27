'use client';

import { useTranslations } from 'next-intl';

import { RatingValue, scaledRating } from '@/entities/player/stats';
import { WinRateCell } from '@/entities/tank/tank';

import type { CandidateCardProps } from './CandidateCard.types';

import { CandidateActions } from '../CandidateActions';
import { CandidateName } from '../CandidateName';
import { CandidateStatusCell } from '../CandidateStatusCell';

import s from './CandidateCard.module.scss';

export const CandidateCard = ({ clanId, candidate }: CandidateCardProps) => {
  const t = useTranslations('clanWorkspace.recruits.columns');

  return (
    <article className={s.root} data-status={candidate.status}>
      <CandidateName candidate={candidate} />
      <dl className={s.stats}>
        <div>
          <dt>{t('wn8')}</dt>
          <dd>
            <RatingValue rating={scaledRating({ scale: 'wn8', value: candidate.stats?.wn8 ?? null })} />
          </dd>
        </div>
        <div>
          <dt>{t('winRate')}</dt>
          <dd>
            <WinRateCell value={candidate.stats?.winRate ?? null} />
          </dd>
        </div>
      </dl>
      <div className={s.footer}>
        <CandidateStatusCell candidate={candidate} clanId={clanId} />
        <CandidateActions candidate={candidate} clanId={clanId} />
      </div>
    </article>
  );
};
