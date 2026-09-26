import { PlayerIdentity } from '@/entities/player/player';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { PlayerCellProps } from './PlayerCell.types';

import s from './PlayerCell.module.scss';

export const PlayerCell = ({ nickname, clanTag }: PlayerCellProps) => (
  <Link className={s.root} href={ROUTES.player(nickname)}>
    <PlayerIdentity player={{ nickname, clanTag }} />
  </Link>
);
