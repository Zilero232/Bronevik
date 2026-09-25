'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { clsx } from 'clsx';

import type { AvatarProps } from './Avatar.types';

import { avatarHue, avatarInitials } from './Avatar.helpers';

import s from './Avatar.module.scss';

export const Avatar = ({ name, src, size = 'md', className }: AvatarProps) => (
  <BaseAvatar.Root className={clsx(s.root, s[size], className)} style={{ '--avatar-hue': avatarHue(name) }}>
    {src && <BaseAvatar.Image alt={name} className={s.image} src={src} />}
    <BaseAvatar.Fallback>{avatarInitials(name)}</BaseAvatar.Fallback>
  </BaseAvatar.Root>
);
