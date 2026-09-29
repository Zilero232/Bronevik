'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ActiveFilterChipsProps } from './ActiveFilterChips.types';

import s from './ActiveFilterChips.module.scss';

export const ActiveFilterChips = ({ active }: ActiveFilterChipsProps) => {
  const t = useTranslations('common.filters');

  return (
    <ul aria-label={t('active')} className={s.root}>
      {active.map(({ id, label, onRemove }) => (
        <li key={id} className={s.chip}>
          <span className={s.label}>{label}</span>
          <button aria-label={t('remove', { label })} className={s.remove} type='button' onClick={onRemove}>
            <X size={12} />
          </button>
        </li>
      ))}
    </ul>
  );
};
