'use client';

import { useTranslations } from 'next-intl';

import { PlayerNameCell } from '@/entities/player/player';

import type { CandidateNameProps } from './CandidateName.types';

import s from './CandidateName.module.scss';

export const CandidateName = ({ candidate }: CandidateNameProps) => {
  const t = useTranslations('clanWorkspace.recruits');

  return (
    <div className={s.root}>
      {candidate.stats?.nickname ? (
        <PlayerNameCell nickname={candidate.stats.nickname} withAvatar={false} />
      ) : (
        <span className={s.unknown}>{t('unknown', { id: candidate.accountId })}</span>
      )}
      {candidate.notes && (
        <p className={s.notes} title={candidate.notes}>
          {candidate.notes}
        </p>
      )}
    </div>
  );
};
