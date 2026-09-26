import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { ReplayOwnerCellProps } from './ReplayOwnerCell.types';

import s from './ReplayOwnerCell.module.scss';

export const ReplayOwnerCell = ({ nickname, clanTag }: ReplayOwnerCellProps) =>
  nickname ? (
    <Link className={s.root} href={ROUTES.player(nickname)}>
      {nickname}
      {clanTag && <span className={s.clan}>[{clanTag}]</span>}
    </Link>
  ) : (
    <span className={s.unknown}>—</span>
  );
