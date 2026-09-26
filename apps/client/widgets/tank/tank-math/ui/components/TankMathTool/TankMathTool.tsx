'use client';

import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { EmptyState } from '@/ui-kit';

import { useTankMathTool } from '../../../model/hooks';
import { TankMath } from '../../TankMath';

import s from './TankMathTool.module.scss';

export const TankMathTool = () => {
  const t = useTranslations('tankMath.tool');
  const { vehicle, setVehicle } = useTankMathTool();

  return (
    <div className={s.root}>
      <header className={s.head}>
        <h2 className={s.title}>{t('title')}</h2>
        <p className={s.description}>{t('description')}</p>
      </header>
      <TankPicker className={s.picker} label={t('tank')} placeholder={t('pickTank')} value={vehicle} onChange={setVehicle} />
      {vehicle ? <TankMath tankId={vehicle.tankId} /> : <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />}
    </div>
  );
};
