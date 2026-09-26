import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { PlayerNameCellProps } from './PlayerNameCell.types';

import { PlayerIdentity } from '../PlayerIdentity';

import s from './PlayerNameCell.module.scss';

export const PlayerNameCell = ({ nickname, clanTag = null, withAvatar = true }: PlayerNameCellProps) => (
  <Link className={s.root} href={ROUTES.players.profile(nickname)}>
    <PlayerIdentity player={{ nickname, clanTag }} withAvatar={withAvatar} />
  </Link>
);
