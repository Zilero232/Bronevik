'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { GameIcon } from '@/entities/tank/build';
import { IconButton } from '@/ui-kit';

import type { ItemSlotProps } from './ItemSlot.types';

import { BUILD_VIEW } from '../../../../../config';

import s from './ItemSlot.module.scss';

export const ItemSlot = ({ item, index, onOpen, onClear }: ItemSlotProps) => {
  const t = useTranslations('builds');

  const category = item?.category ?? null;

  return (
    <div className={s.root} data-category={category ?? undefined} data-filled={item !== null}>
      <button
        aria-label={`${t('slot.index', { index: index + 1 })}: ${item?.name ?? t('slot.empty')}`}
        className={s.socket}
        type='button'
        onClick={onOpen}
      >
        {item ? (
          <>
            <GameIcon className={s.icon} size={BUILD_VIEW.iconSize.slot} src={item.image} />
            <span className={s.content}>
              <span className={s.name}>{item.name}</span>
              {category && <span className={s.category}>{t(`categories.${category}`)}</span>}
            </span>
          </>
        ) : (
          <span className={s.hint}>{t('slot.emptyHint')}</span>
        )}
      </button>
      {item && (
        <IconButton aria-label={t('slot.clear')} className={s.clear} size='sm' onClick={onClear}>
          <X size={14} />
        </IconButton>
      )}
    </div>
  );
};
