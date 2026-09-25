'use client';

import { Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { POPUP } from '@/shared/lib';
import { IconButton } from '@/ui-kit';

import type { ItemSlotProps } from './ItemSlot.types';

import { CATEGORY_ICONS } from '../../../../../config';

import s from './ItemSlot.module.scss';

export const ItemSlot = ({ item, index, onOpen, onClear }: ItemSlotProps) => {
  const t = useTranslations('builds');

  const category = item?.category ?? null;
  const CategoryIcon = category ? CATEGORY_ICONS[category] : null;
  const label = `${t('slot.index', { index: index + 1 })}: ${item?.name ?? t('slot.empty')}`;

  return (
    <div className={s.root} data-category={category ?? undefined} data-filled={item !== null}>
      <button aria-label={label} className={s.socket} type='button' onClick={onOpen}>
        <span className={s.meta}>
          <span className={s.index}>{String(index + 1).padStart(2, '0')}</span>
          {category && CategoryIcon && (
            <span className={s.category}>
              <CategoryIcon size={12} strokeWidth={2} />
              {t(`categories.${category}`)}
            </span>
          )}
        </span>
        <AnimatePresence initial={false} mode='popLayout'>
          <motion.span key={item?.id ?? 'empty'} animate='visible' className={s.content} exit='exit' initial='hidden' variants={POPUP}>
            {item ? (
              <>
                <span className={s.name}>{item.name}</span>
              </>
            ) : (
              <>
                <span className={s.plus}>
                  <Plus size={18} />
                </span>
                <span className={s.hint}>{t('slot.emptyHint')}</span>
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </button>
      {item && (
        <IconButton aria-label={t('slot.clear')} className={s.clear} size='sm' onClick={onClear}>
          <X size={14} />
        </IconButton>
      )}
    </div>
  );
};
