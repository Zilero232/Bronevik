import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { PlayerCellProps } from './PlayerCell.types';

import s from './PlayerCell.module.scss';

export const PlayerCell = ({ entry }: PlayerCellProps) => (
  <span className={s.root}>
    <Link className={s.name} href={ROUTES.player(entry.name)}>
      {entry.name}
    </Link>
    {entry.clanTag && <span className={s.clan}>[{entry.clanTag}]</span>}
  </span>
);
