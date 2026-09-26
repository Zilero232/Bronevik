'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton, Select, Switch } from '@/ui-kit';

import type { ComparePickerProps } from './ComparePicker.types';

import { COMPARE_SETTINGS_PAGE } from '../../../config';

import s from './ComparePicker.module.scss';

export const ComparePicker = ({ picked, addItems, canAdd, isMine, isSignedIn, onAdd, onRemove, onMineChange }: ComparePickerProps) => {
  const t = useTranslations('streamerSettings.compare');

  return (
    <div className={s.root}>
      {picked.map(({ slug, label }) => (
        <span key={slug} className={s.chip}>
          {label}
          <IconButton aria-label={t('remove', { name: label })} size='sm' onClick={() => onRemove(slug)}>
            <X size={COMPARE_SETTINGS_PAGE.iconSize} />
          </IconButton>
        </span>
      ))}
      {canAdd && <Select aria-label={t('add')} items={addItems} value={COMPARE_SETTINGS_PAGE.addValue} onValueChange={onAdd} />}
      {isSignedIn && (
        <span className={s.mine}>
          <Switch checked={isMine} label={t('mineToggle')} onCheckedChange={onMineChange} />
        </span>
      )}
    </div>
  );
};
