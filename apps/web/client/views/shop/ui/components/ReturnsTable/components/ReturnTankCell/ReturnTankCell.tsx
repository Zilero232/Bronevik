import { TankLink } from '@/entities/tank/tank';

import type { ReturnTankCellProps } from './ReturnTankCell.types';

export const ReturnTankCell = ({ row }: ReturnTankCellProps) =>
  row.vehicle ? <TankLink image='small' vehicle={row.vehicle} /> : <span>{row.tankName ?? `#${row.tankId}`}</span>;
