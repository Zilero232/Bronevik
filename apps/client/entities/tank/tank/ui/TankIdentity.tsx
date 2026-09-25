import { NATION_ICONS, TANK_CLASS_ICONS, toRoman } from '@bronevik/icons';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { TankIdentityProps } from './TankIdentity.types';

import { TankImage } from './TankImage';

import s from './TankIdentity.module.scss';

export const TankIdentity = ({ tank, size = 'md', withNation = true, image, className }: TankIdentityProps) => {
  const t = useTranslations('game');
  const ClassIcon = TANK_CLASS_ICONS[tank.type];
  const NationIcon = NATION_ICONS[tank.nation];

  return (
    <span className={clsx(s.root, s[size], className)} data-premium={tank.isPremium}>
      {image && <TankImage isDecorative className={s.image} size={image} tank={tank} />}
      <span className={s.class} title={t(`classes.${tank.type}`)}>
        <ClassIcon size={size === 'lg' ? 26 : 18} variant={tank.isPremium ? 'premium' : 'regular'} />
      </span>
      <span className={s.tier}>{toRoman(tank.tier)}</span>
      <span className={s.name}>{tank.name}</span>
      {withNation && (
        <span className={s.nation} title={t(`nations.${tank.nation}`)}>
          <NationIcon palette='color' size={size === 'lg' ? 20 : 16} />
        </span>
      )}
    </span>
  );
};
