'use client';

import { useTranslations } from 'next-intl';

import { EntityPicker } from '@/features/search/pick-entity';

import type { AddCandidateProps } from './AddCandidate.types';

import { useAddCandidate } from '../../../../../model/hooks';

import s from './AddCandidate.module.scss';

export const AddCandidate = ({ clanId }: AddCandidateProps) => {
  const t = useTranslations('clanWorkspace.recruits');
  const { isAdding, onPick } = useAddCandidate({ clanId });

  return <EntityPicker className={s.root} isDisabled={isAdding} kind='player' placeholder={t('add')} onPick={onPick} />;
};
