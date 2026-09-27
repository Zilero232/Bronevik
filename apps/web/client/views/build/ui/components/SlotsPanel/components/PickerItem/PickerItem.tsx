'use client';

import { useTranslations } from 'next-intl';

import { GameIcon } from '@/entities/tank/build';
import { Badge } from '@/ui-kit';

import type { PickerItemProps } from './PickerItem.types';

import { BUILD_VIEW } from '../../../../../config';

import s from './PickerItem.module.scss';

export const PickerItem = ({ item, isSelected, isTaken, onPick }: PickerItemProps) => {
  const t = useTranslations('builds');

  const { id, name, kind, image, category, isPremium } = item;

  return (
    <li className={s.item}>
      <button
        aria-pressed={isSelected}
        className={s.root}
        data-category={category ?? undefined}
        disabled={isTaken}
        type='button'
        onClick={() => onPick(id)}
      >
        <GameIcon kind={kind} size={BUILD_VIEW.iconSize.picker} src={image} />
        <span className={s.text}>
          <span className={s.name}>{name}</span>
          <span className={s.tags}>
            {category && <span className={s.category}>{t(`categories.${category}`)}</span>}
            {isTaken && <span className={s.taken}>{t('slot.taken')}</span>}
          </span>
        </span>
        {isPremium && <Badge tone='warning'>{t('slot.premium')}</Badge>}
      </button>
    </li>
  );
};
