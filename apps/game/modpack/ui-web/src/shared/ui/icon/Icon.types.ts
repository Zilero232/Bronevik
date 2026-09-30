import type { UiIconName, UiIconTone } from '../../lib/icon-sprite';

export type IconProps = {
  name: UiIconName;
  size?: number;
  tone?: UiIconTone;
  className?: string;
};
