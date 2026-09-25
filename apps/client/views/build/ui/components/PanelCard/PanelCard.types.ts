import type { ReactNode } from 'react';

import type { BuildIcon } from '../../../config';

export type PanelCardProps = {
  index: string;
  title: ReactNode;
  description?: ReactNode;
  icon: BuildIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};
