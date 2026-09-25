import type { VehicleType } from '@bronevik/schemas';

import type { TankClassGlyphProps, TankClassIconProps } from './icons.types';

import { IconBase } from '../lib';
import { CLASS_GLYPHS, CLASS_SLUGS, CLASS_VARIANT } from './classes.shapes';

const Laurel = () => (
  <g fill={CLASS_VARIANT.eliteColor} stroke={CLASS_VARIANT.eliteColor} strokeWidth={0.9}>
    {[CLASS_VARIANT.laurel.left, CLASS_VARIANT.laurel.right].map(({ stem, leaves }) => (
      <g key={stem}>
        <path d={stem} fill='none' />
        {leaves.map((d) => (
          <path key={d} d={d} stroke='none' />
        ))}
      </g>
    ))}
  </g>
);

export const TankClassIcon = ({ tankClass, variant = 'regular', ...props }: TankClassIconProps) => (
  <IconBase data-variant={variant} name={`class-${CLASS_SLUGS[tankClass]}`} {...props}>
    {variant === 'elite' && <Laurel />}
    <g
      fill={variant === 'premium' ? CLASS_VARIANT.premiumFill : 'currentColor'}
      stroke='none'
      style={variant === 'premium' ? { filter: CLASS_VARIANT.premiumGlow } : undefined}
      transform={variant === 'elite' ? CLASS_VARIANT.eliteTransform : undefined}
    >
      {CLASS_GLYPHS[tankClass].map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  </IconBase>
);

const classIcon = (tankClass: VehicleType) => {
  const Icon = (props: TankClassGlyphProps) => <TankClassIcon tankClass={tankClass} {...props} />;

  Icon.displayName = `class-${CLASS_SLUGS[tankClass]}`;

  return Icon;
};

export const LightTankIcon = classIcon('lightTank');

export const MediumTankIcon = classIcon('mediumTank');

export const HeavyTankIcon = classIcon('heavyTank');

export const TankDestroyerIcon = classIcon('AT-SPG');

export const SpgIcon = classIcon('SPG');
