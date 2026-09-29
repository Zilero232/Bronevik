'use client';

import { Crosshair } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button } from '@/ui-kit';

import { useAttackerPicker } from '../../../model/hooks';

import s from './AttackerPicker.module.scss';

export const AttackerPicker = () => {
  const t = useTranslations('armor.attack');
  const { vehicle, isOwn, isAttackerError, onPick, onReset } = useAttackerPicker();

  return (
    <div className={s.root}>
      <TankPicker label={t('attacker')} placeholder={t('ownGun')} value={vehicle} onChange={onPick} />
      <p className={s.note}>{t(isOwn ? 'ownNote' : 'foreignNote')}</p>
      {!isOwn && (
        <Button className={s.reset} size='sm' variant='ghost' onClick={onReset}>
          <Crosshair aria-hidden size={14} />
          {t('useOwn')}
        </Button>
      )}
      {isAttackerError && (
        <p className={s.error} role='alert'>
          {t('error')}
        </p>
      )}
    </div>
  );
};
