import type { AnimatedLogoMarkProps } from '../animated.types';

import { LOGO_SHAPES } from '../../icons';
import { IconBase } from '../../lib';
import { LOGO_MARK_STYLE } from '../animated.constants';

export const AnimatedLogoMark = ({ delay = 0.15, ...props }: AnimatedLogoMarkProps) => (
  <IconBase name='otmetki-logo-mark' {...props}>
    <style>{LOGO_MARK_STYLE}</style>
    {LOGO_SHAPES.marks.map((d, index) => (
      <path key={d} className='otmetki-logo-mark-bar' d={d} pathLength={1} style={{ animationDelay: `${delay + index * 0.14}s` }} />
    ))}
  </IconBase>
);
