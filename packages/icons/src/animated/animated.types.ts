import type { MarkCount, MasteryLevel } from '../icons/icons.types';
import type { IconProps } from '../lib';

export type AnimatedLogoProps = IconProps & {
  withTracer?: boolean;
};

export type AnimatedMarkOfExcellenceProps = IconProps & {
  marks: MarkCount;
};

export type AnimatedMasteryProps = IconProps & {
  level: MasteryLevel;
  tinted?: boolean;
};
