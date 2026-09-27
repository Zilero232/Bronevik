'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton, Select, Switch } from '@/ui-kit';

import { COMPARE_SETTINGS_PAGE } from '../../../config';
import { useComparePicker } from '../../../model/hooks';

import s from './ComparePicker.module.scss';

export const ComparePicker = () => {
  const t = useTranslations('streamerSettings.compare');
  const { picked, addItems, canAdd, isMine, isSignedIn, onAdd, onRemove, onMineChange } = useComparePicker();

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
