import { TankCell } from '@/entities/tank/tank';

import type { ReplayTankCellProps } from './ReplayTankCell.types';

import s from './ReplayTankCell.module.scss';

export const ReplayTankCell = ({ vehicle }: ReplayTankCellProps) =>
  vehicle ? <TankCell className={s.root} vehicle={vehicle} /> : <span className={s.unknown}>—</span>;
