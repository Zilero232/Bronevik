import type { ReactNode } from 'react';

import type { CardHeaderProps, CardProps } from '../Card';

export type TextCardProps = Pick<CardHeaderProps, 'title'> &
  Pick<CardProps, 'className'> & {
    children: ReactNode;
  };
