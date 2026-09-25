'use client';

import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { STAGGER_ITEM } from '@/shared/lib';
import { Badge } from '@/ui-kit';

import type { PickerItemProps } from './PickerItem.types';

import { CATEGORY_ICONS } from '../../../../../config';

import s from './PickerItem.module.scss';

export const PickerItem = ({ item, isSelected, isTaken, onPick }: PickerItemProps) => {
  const t = useTranslations('builds');

  const { id, name, category, isPremium } = item;
  const CategoryIcon = category ? CATEGORY_ICONS[category] : null;

  return (
    <motion.li className={s.item} variants={STAGGER_ITEM}>
      <button
        aria-pressed={isSelected}
        className={s.root}
        data-category={category ?? undefined}
        data-selected={isSelected}
        disabled={isTaken}
        type='button'
        onClick={() => onPick(id)}
      >
        <span className={s.head}>
          {CategoryIcon && (
            <span className={s.icon}>
              <CategoryIcon size={14} strokeWidth={2} />
            </span>
          )}
          <span className={s.name}>{name}</span>
          {isSelected && <Check className={s.check} size={16} />}
        </span>
        <span className={s.tags}>
          {category && <span className={s.spec}>{t(`categories.${category}`)}</span>}
          {isPremium && <Badge tone='warning'>{t('slot.premium')}</Badge>}
          {isTaken && <span className={s.taken}>{t('slot.taken')}</span>}
        </span>
      </button>
    </motion.li>
  );
};
