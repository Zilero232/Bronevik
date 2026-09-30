import type { ReactNode } from 'react';

import type { UiIconName } from '../../lib/icon-sprite';

export type EmptyProps = {
  children: ReactNode;
  icon?: UiIconName;
};
