'use client';

import { useTranslations } from 'next-intl';

import { Select } from '@/ui-kit';

import type { CandidateStatusCellProps } from './CandidateStatusCell.types';

import { useCandidateActions } from '../../../../../model/hooks';

import s from './CandidateStatusCell.module.scss';

export const CandidateStatusCell = ({ clanId, candidate }: CandidateStatusCellProps) => {
  const t = useTranslations('clanWorkspace.recruits');
  const { name, statuses, onStatusChange } = useCandidateActions({ clanId, candidate });

  return (
    <div className={s.root} data-status={candidate.status}>
      <Select aria-label={t('statusFor', { name })} items={statuses} value={candidate.status} onValueChange={onStatusChange} />
    </div>
  );
};
