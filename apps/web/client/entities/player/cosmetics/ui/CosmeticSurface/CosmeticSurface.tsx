import { clsx } from 'clsx';

import type { CosmeticSurfaceProps } from './CosmeticSurface.types';

import { cosmeticTone } from '../../lib/cosmetic-look';

import s from './CosmeticSurface.module.scss';

export const CosmeticSurface = ({ banner, frame, children, className }: CosmeticSurfaceProps) => (
  <div className={clsx(s.root, className)} data-banner={cosmeticTone(banner) ?? undefined} data-frame={cosmeticTone(frame) ?? undefined}>
    {children}
  </div>
);
