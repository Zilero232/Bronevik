import type { IconProps } from '../lib';
import type { MasteryIconProps } from './icons.types';

import { IconBase } from '../lib';
import { MASTERY, MASTERY_EMBLEM, MASTERY_TINTS } from './mastery.shapes';

export const MasteryIcon = ({ level, tinted = false, color, style, ...props }: MasteryIconProps) => {
  const tint = tinted ? MASTERY_TINTS[level] : undefined;

  return (
    <IconBase
      color={tint ?? color}
      data-tinted={tinted || undefined}
      name={`mastery-${level}`}
      style={tinted && level === 'master' ? { filter: MASTERY.glow, ...style } : style}
      {...props}
    >
      <path d={MASTERY.shield} fill={tint} fillOpacity={tint ? MASTERY.fillOpacity : undefined} />
      {MASTERY_EMBLEM[level].map((d) => (
        <path key={d} d={d} fill={tint && level === 'master' ? tint : undefined} />
      ))}
    </IconBase>
  );
};

export const MasteryThirdIcon = (props: IconProps) => <MasteryIcon level='third' {...props} />;

export const MasterySecondIcon = (props: IconProps) => <MasteryIcon level='second' {...props} />;

export const MasteryFirstIcon = (props: IconProps) => <MasteryIcon level='first' {...props} />;

export const MasteryMasterIcon = (props: IconProps) => <MasteryIcon level='master' {...props} />;
