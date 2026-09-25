import { clsx } from 'clsx';

import { Avatar } from '@/ui-kit';

import type { PlayerIdentityProps } from './PlayerIdentity.types';

import s from './PlayerIdentity.module.scss';

export const PlayerIdentity = ({ player, size = 'md', className }: PlayerIdentityProps) => (
  <span className={clsx(s.root, s[size], className)}>
    <Avatar name={player.nickname} size={size === 'lg' ? 'lg' : 'sm'} />
    <span className={s.text}>
      <span className={s.nickname}>{player.nickname}</span>
      {player.clanTag && <span className={s.clan}>[{player.clanTag}]</span>}
    </span>
  </span>
);
