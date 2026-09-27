import { clsx } from 'clsx';
import { createElement } from 'react';

import type { CosmeticBadgeProps } from './CosmeticBadge.types';

import { badgeIcon, cosmeticTone } from '../../lib/cosmetic-look';
import { CosmeticName } from '../CosmeticName';

import s from './CosmeticBadge.module.scss';

export const CosmeticBadge = ({ code, isCompact = false, className }: CosmeticBadgeProps) => (
  <span className={clsx(s.root, isCompact && s.compact, className)} data-cosmetic={cosmeticTone(code) ?? undefined}>
    {createElement(badgeIcon(code), { 'aria-hidden': true, size: isCompact ? 11 : 13 })}
    <span className={isCompact ? s.hidden : s.name}>
      <CosmeticName code={code} />
    </span>
  </span>
);
