import { CosmeticBadge } from '@/entities/player/cosmetics';
import { PlayerIdentity } from '@/entities/player/player';
import { Link } from '@/shared/i18n/navigation';

import type { EntrantCellProps } from './EntrantCell.types';

import { entrantLink } from '../../../../../lib/entrant-link';

import s from './EntrantCell.module.scss';

export const EntrantCell = ({ entry, badge }: EntrantCellProps) => (
  <Link className={s.root} href={entrantLink(entry).href}>
    {entry.accountId === null ? (
      <>
        <span className={s.tag} style={{ borderColor: entry.color ?? undefined }}>
          [{entry.clanTag}]
        </span>
        <span className={s.name}>{entry.name}</span>
      </>
    ) : (
      <>
        <PlayerIdentity player={{ nickname: entry.name, clanTag: entry.clanTag }} />
        {badge && <CosmeticBadge isCompact code={badge} />}
      </>
    )}
  </Link>
);
