import { ClanEmblem } from '@/entities/clan/clan';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { ClanCellProps } from './ClanCell.types';

import s from './ClanCell.module.scss';

export const ClanCell = ({ clan: { tag, emblem, color } }: ClanCellProps) => (
  <Link className={s.root} href={ROUTES.clans.detail(tag)} style={color ? { '--clan': color } : undefined}>
    <ClanEmblem color={color} size='sm' src={emblem} tag={tag} />
    <span className={s.tag}>[{tag}]</span>
  </Link>
);
