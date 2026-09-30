import type { ReactNode } from 'react';

import type { UiIconName } from '../../lib/icon-sprite';

export type PageHeaderProps = {
  icon: UiIconName;
  title: string;
  hint?: string | null;
  aside?: ReactNode;
};
