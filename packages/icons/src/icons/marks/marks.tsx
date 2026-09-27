import type { IconProps } from '../../lib';
import type { MarkOfExcellenceIconProps } from '../icons.types';

import { IconBase } from '../../lib';
import { MARK_SHAPES, RING_SHAPES } from './marks.shapes';

export const MarkOfExcellenceIcon = ({ marks, markStyle = 'stars', ...props }: MarkOfExcellenceIconProps) => {
  if (markStyle === 'rings') {
    return (
      <IconBase data-style='rings' name={`mark-${marks}`} {...props}>
        <path d={RING_SHAPES.barrel} />
        <path d={RING_SHAPES.brake} />
        {RING_SHAPES.rings(marks).map((d) => (
          <path key={d} d={d} />
        ))}
      </IconBase>
    );
  }

  return (
    <IconBase data-style='stars' name={`mark-${marks}`} {...props}>
      <path d={MARK_SHAPES.barrel} />
      <path d={MARK_SHAPES.brake} />
      {MARK_SHAPES.stripes(marks).map((d) => (
        <path key={d} d={d} />
      ))}
      {MARK_SHAPES.stars(marks).map((d) => (
        <path key={d} d={d} />
      ))}
    </IconBase>
  );
};

export const Mark1Icon = (props: IconProps) => <MarkOfExcellenceIcon marks={1} {...props} />;

export const Mark2Icon = (props: IconProps) => <MarkOfExcellenceIcon marks={2} {...props} />;

export const Mark3Icon = (props: IconProps) => <MarkOfExcellenceIcon marks={3} {...props} />;
