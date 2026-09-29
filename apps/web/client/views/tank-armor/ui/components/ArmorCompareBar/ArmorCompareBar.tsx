'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button } from '@/ui-kit';

import type { ArmorCompareBarProps } from './ArmorCompareBar.types';

import s from './ArmorCompareBar.module.scss';

export const ArmorCompareBar = ({ vehicle, excludeIds, onPick, onClear }: ArmorCompareBarProps) => {
  const t = useTranslations('armor.compare');

  return (
    <div className={s.root} data-testid='armor-compare'>
      <TankPicker className={s.picker} excludeIds={excludeIds} label={t('pick')} placeholder={t('placeholder')} value={vehicle} onChange={onPick} />
      {vehicle && (
        <Button size='sm' variant='ghost' onClick={onClear}>
          <X aria-hidden size={14} />
          {t('clear')}
        </Button>
      )}
      <p className={s.note}>{t('note')}</p>
    </div>
  );
};
