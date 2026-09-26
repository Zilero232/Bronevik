import { NationFlag } from '@otmetki/icons';
import { clsx } from 'clsx';

import { TankImage } from '@/ui-kit';

import type { TankHeroImageProps } from './TankHeroImage.types';

import s from './TankHeroImage.module.scss';

export const TankHeroImage = ({ tank, className }: TankHeroImageProps) => (
  <div className={clsx(s.root, className)} data-nation={tank.nation}>
    <NationFlag aria-hidden className={s.flag} nation={tank.nation} />
    <TankImage isPriority className={s.render} size='big' tank={tank} withTint={false} />
  </div>
);
