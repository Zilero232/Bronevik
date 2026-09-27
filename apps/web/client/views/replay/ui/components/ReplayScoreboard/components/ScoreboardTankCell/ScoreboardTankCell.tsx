import { TankCell } from '@/entities/tank/tank';

import type { ScoreboardTankCellProps } from './ScoreboardTankCell.types';

import s from './ScoreboardTankCell.module.scss';

export const ScoreboardTankCell = ({ vehicle }: ScoreboardTankCellProps) =>
  vehicle ? <TankCell image='contour' vehicle={vehicle} /> : <span className={s.unknown}>—</span>;
