import { CosmeticBadge } from '@/entities/player/cosmetics';
import { PlayerIdentity } from '@/entities/player/player';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { EntrantCellProps } from './EntrantCell.types';

import s from './EntrantCell.module.scss';

export const EntrantCell = ({ entry: { accountId, clanTag, name, color }, badge }: EntrantCellProps) =>
  accountId === null ? (
    <Link className={s.root} href={ROUTES.clans.detail(clanTag ?? name)}>
      <span className={s.tag} style={{ borderColor: color ?? undefined }}>
        [{clanTag}]
      </span>
      <span className={s.name}>{name}</span>
    </Link>
  ) : (
    <Link className={s.root} href={ROUTES.players.profile(name)}>
      <PlayerIdentity player={{ nickname: name, clanTag }} />
      {badge && <CosmeticBadge isCompact code={badge} />}
    </Link>
  );
