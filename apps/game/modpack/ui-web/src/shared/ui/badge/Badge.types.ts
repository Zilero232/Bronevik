import type { ComponentChildren } from 'preact';

import type { UiIconName } from '../../lib/icon-sprite';

export type BadgeTone = 'accent' | 'default' | 'gold';

export type BadgeProps = {
  tone?: BadgeTone;
  icon?: UiIconName;
  children: ComponentChildren;
};
