import type { ReactNode } from 'react';

export type PlateProps = {
  label: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
};
