import type { IconProps } from '../lib';
import type { MasteryIconProps, MasteryLevel } from './icons.types';

import { IconBase, starPath } from '../lib';

export const MASTERY_SHIELD = 'M12 2.5 20 5.5v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z';

const chevron = (y: number) => `M8 ${y}l4 3 4-3`;

export const MASTERY_EMBLEM: Record<MasteryLevel, string[]> = {
  third: [chevron(10)],
  second: [chevron(8.2), chevron(12.2)],
  first: [chevron(6.6), chevron(10.3), chevron(14)],
  master: [starPath({ cx: 12, cy: 11.4, outer: 4.8, inner: 2 })]
};

export const MASTERY_TINTS: Record<MasteryLevel, string> = {
  third: 'var(--bronevik-mastery-third, #b0714a)',
  second: 'var(--bronevik-mastery-second, #aeb6bf)',
  first: 'var(--bronevik-mastery-first, #e0b24c)',
  master: 'var(--bronevik-mastery-master, #e0b24c)'
};

export const MASTERY_GLOW = 'drop-shadow(0 0 2px var(--bronevik-icon-accent, #ff6b1a))';

export const MASTERY_FILL_OPACITY = 0.16;

export const MasteryIcon = ({ level, tinted = false, color, style, ...props }: MasteryIconProps) => {
  const tint = tinted ? MASTERY_TINTS[level] : undefined;

  return (
    <IconBase
      color={tint ?? color}
      data-tinted={tinted || undefined}
      name={`mastery-${level}`}
      style={tinted && level === 'master' ? { filter: MASTERY_GLOW, ...style } : style}
      {...props}
    >
      <path d={MASTERY_SHIELD} fill={tint} fillOpacity={tint ? MASTERY_FILL_OPACITY : undefined} />
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
