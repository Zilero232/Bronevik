import { ClanEmblem } from '@/entities/clan/clan';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { ClanCellProps } from './ClanCell.types';

import s from './ClanCell.module.scss';

export const ClanCell = ({ clan }: ClanCellProps) => (
  <Link className={s.root} href={ROUTES.clan(clan.tag)}>
    <ClanEmblem color={clan.color} size='sm' src={clan.emblem} tag={clan.tag} />
    <span className={s.tag}>[{clan.tag}]</span>
    <span className={s.name}>{clan.name}</span>
  </Link>
);
