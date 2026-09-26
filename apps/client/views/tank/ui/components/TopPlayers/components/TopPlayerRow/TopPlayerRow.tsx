import { PlayerIdentity } from '@/entities/player/player';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { TopPlayerRowProps } from './TopPlayerRow.types';

import s from './TopPlayerRow.module.scss';

export const TopPlayerRow = ({ row }: TopPlayerRowProps) => (
  <tr className={s.root}>
    <td className={s.rank} data-podium={row.isPodium}>
      {row.rank}
    </td>
    <td className={s.player}>
      <Link className={s.link} href={ROUTES.player(row.player.nickname)}>
        <PlayerIdentity player={row.player} />
      </Link>
    </td>
    <td className={s.number}>{row.battles}</td>
    <td className={s.metric} data-tone={row.tone}>
      {row.value}
    </td>
  </tr>
);
