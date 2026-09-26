'use client';

import { useTranslations } from 'next-intl';

import { EntityPicker } from '@/features/search/pick-entity';

import type { AddSlotProps } from './AddSlot.types';

import { COMPARE_LIMIT } from '../../../config';

import s from './AddSlot.module.scss';

export const AddSlot = ({ index, excludeIds, onAdd }: AddSlotProps) => {
  const t = useTranslations('compare');

  return (
    <div className={s.root}>
      <span className={s.label}>{t('slot', { index: index + 1, max: COMPARE_LIMIT.max })}</span>
      <EntityPicker excludeIds={excludeIds} kind='player' placeholder={t('add')} onPick={({ accountId }) => onAdd(accountId)} />
    </div>
  );
};
