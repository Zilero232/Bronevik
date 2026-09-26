'use client';

import { COMPARE } from '@bronevik/schemas';
import { Link2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button } from '@/ui-kit';

import { useCompareDock } from '../../../model/hooks';

import s from './CompareDock.module.scss';

export const CompareDock = () => {
  const t = useTranslations('tanks.compare.dock');
  const { ids, count, isFull, isEmpty, onPick, onCopy, onClear } = useCompareDock();

  return (
    <div className={s.root}>
      <div className={s.picker}>
        {isFull ? (
          <p className={s.full}>{t('full', { max: COMPARE.maxTanks })}</p>
        ) : (
          <TankPicker excludeIds={ids} label={t('add')} value={null} onChange={onPick} />
        )}
      </div>
      <span className={s.count}>{t('count', { count, max: COMPARE.maxTanks })}</span>
      <Button disabled={isEmpty} size='sm' variant='secondary' onClick={onCopy}>
        <Link2 size={14} />
        {t('copy')}
      </Button>
      <Button disabled={isEmpty} size='sm' variant='ghost' onClick={onClear}>
        {t('clear')}
      </Button>
    </div>
  );
};
