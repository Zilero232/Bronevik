import type { ComponentChildren } from 'preact';

import type { UiIconName } from '../../lib/icon-sprite';

export type PageHeaderProps = {
  icon: UiIconName;
  title: string;
  hint?: string | null;
  aside?: ComponentChildren;
};
