import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { MateCellProps } from './MateCell.types';

import s from './MateCell.module.scss';

export const MateCell = ({ accountId, nickname }: MateCellProps) => (
  <Link className={s.root} href={ROUTES.players.profile(nickname ?? String(accountId))}>
    {nickname ?? accountId}
  </Link>
);
