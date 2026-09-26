import { ModeIcon } from '@/entities/map/map';
import { Link } from '@/shared/i18n/navigation';
import { Badge } from '@/ui-kit';

import type { ReplayMapCellProps } from './ReplayMapCell.types';

import s from './ReplayMapCell.module.scss';

export const ReplayMapCell = ({ href, mapName, mode, modeLabel, statusLabel, isFailed }: ReplayMapCellProps) => (
  <span className={s.root}>
    <Link className={s.map} href={href}>
      {mapName}
    </Link>
    <span className={s.meta}>
      {mode && <ModeIcon mode={mode} size={13} />}
      {modeLabel && <span className={s.mode}>{modeLabel}</span>}
      {statusLabel && <Badge tone={isFailed ? 'danger' : 'warning'}>{statusLabel}</Badge>}
    </span>
  </span>
);
