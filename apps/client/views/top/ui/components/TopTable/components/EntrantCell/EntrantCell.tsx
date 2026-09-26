import { PlayerIdentity } from '@/entities/player/player';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { EntrantCellProps } from './EntrantCell.types';

import s from './EntrantCell.module.scss';

export const EntrantCell = ({ entry: { accountId, clanTag, name, color } }: EntrantCellProps) =>
  accountId === null ? (
    <Link className={s.root} href={ROUTES.clan(clanTag ?? name)}>
      <span className={s.tag} style={{ borderColor: color ?? undefined }}>
        [{clanTag}]
      </span>
      <span className={s.name}>{name}</span>
    </Link>
  ) : (
    <Link className={s.root} href={ROUTES.player(name)}>
      <PlayerIdentity player={{ nickname: name, clanTag }} />
    </Link>
  );
