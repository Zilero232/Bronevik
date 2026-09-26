import { useFormatter, useTranslations } from 'next-intl';

import { TankLink, WinRateCell } from '@/entities/tank/tank';
import { KeyFigure, KeyFigures, RelativeTime } from '@/ui-kit';

import type { MyModeLineViewProps } from './MyModeLineView.types';

import { MODE_FIGURES } from '../../../../../config';

import s from './MyModeLineView.module.scss';

export const MyModeLineView = ({ line, tanks }: MyModeLineViewProps) => {
  const t = useTranslations('modes.mine');
  const format = useFormatter();

  return (
    <div className={s.root}>
      <KeyFigures isFramed={false}>
        <KeyFigure label={t('battles')} value={line.battles} />
        <KeyFigure format={MODE_FIGURES.winRate} label={t('winRate')} suffix='%' value={line.winRate} />
        <KeyFigure format={MODE_FIGURES.average} label={t('avgDamage')} value={line.avgDamage} />
        <KeyFigure format={MODE_FIGURES.average} label={t('avgXp')} value={line.avgXp} />
        <KeyFigure format={MODE_FIGURES.frags} label={t('avgFrags')} value={line.avgFrags} />
        <KeyFigure format={MODE_FIGURES.winRate} label={t('survival')} suffix='%' value={line.survivalRate} />
        <KeyFigure label={t('lastBattle')} value={line.lastBattleAt && <RelativeTime value={line.lastBattleAt} />} />
      </KeyFigures>
      {tanks.length > 0 && (
        <ul className={s.list}>
          {tanks.map((tank) => (
            <li key={tank.vehicle.tankId} className={s.row}>
              <TankLink className={s.tank} image='small' vehicle={tank.vehicle} />
              <span className={s.value}>{t('tankLine', { battles: tank.battles, damage: format.number(tank.avgDamage, MODE_FIGURES.average) })}</span>
              <WinRateCell className={s.value} value={tank.winRate} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
