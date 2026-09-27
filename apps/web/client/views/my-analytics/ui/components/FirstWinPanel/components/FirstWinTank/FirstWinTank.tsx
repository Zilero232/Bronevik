import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';

import type { FirstWinTankProps } from './FirstWinTank.types';

import s from './FirstWinTank.module.scss';

export const FirstWinTank = ({ tank }: FirstWinTankProps) => {
  const t = useTranslations('analytics.firstWin');

  return (
    <li className={s.root} data-taken={tank.isTaken}>
      <TankCell image='contour' vehicle={tank.vehicle} />
      <span className={s.state}>
        {tank.isTaken && <Check aria-hidden size={14} />}
        {t(tank.isTaken ? 'isTaken' : 'isAvailable')}
      </span>
    </li>
  );
};
