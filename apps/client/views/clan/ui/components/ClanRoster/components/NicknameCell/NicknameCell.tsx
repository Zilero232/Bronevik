import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { NicknameCellProps } from './NicknameCell.types';

import s from './NicknameCell.module.scss';

export const NicknameCell = ({ nickname }: NicknameCellProps) => (
  <Link className={s.root} href={ROUTES.player(nickname)}>
    {nickname}
  </Link>
);
