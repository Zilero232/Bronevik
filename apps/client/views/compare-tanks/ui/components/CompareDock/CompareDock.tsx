'use client';

import type { VehicleSummary } from '@bronevik/schemas';

import { COMPARE } from '@bronevik/schemas';
import { Link2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { TankPicker } from '@/features/tank/pick-tank';
import { SPRING } from '@/shared/lib';
import { Button } from '@/ui-kit';

import { useCompareIds } from '../../../model/hooks';

import s from './CompareDock.module.scss';

const SLOTS = Array.from({ length: COMPARE.maxTanks }, (_, index) => index);

export const CompareDock = () => {
  const t = useTranslations('tanks.compare.dock');
  const { ids, isFull, add, clear } = useCompareIds();

  const isEmpty = ids.length === 0;

  const onPick = (vehicle: VehicleSummary | null) => {
    if (vehicle) {
      add(vehicle.tankId);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t('copied'));
    } catch {
      toast.error(t('copyFailed'));
    }
  };

  return (
    <div className={s.root}>
      <div className={s.head}>
        <span className={s.label}>{t('slots')}</span>
        <span className={s.count}>{t('count', { count: ids.length, max: COMPARE.maxTanks })}</span>
      </div>
      <ol aria-hidden className={s.slots}>
        {SLOTS.map((slot) => (
          <li key={slot} className={s.slot}>
            <motion.span animate={{ scaleX: slot < ids.length ? 1 : 0 }} className={s.fill} initial={false} transition={SPRING} />
          </li>
        ))}
      </ol>
      {isFull ? (
        <p className={s.full}>{t('full', { max: COMPARE.maxTanks })}</p>
      ) : (
        <TankPicker excludeIds={ids} label={t('add')} value={null} onChange={onPick} />
      )}
      <div className={s.actions}>
        <Button disabled={isEmpty} size='sm' variant='secondary' onClick={() => void onCopy()}>
          <Link2 size={14} />
          {t('copy')}
        </Button>
        <Button disabled={isEmpty} size='sm' variant='ghost' onClick={clear}>
          <Trash2 size={14} />
          {t('clear')}
        </Button>
      </div>
    </div>
  );
};
