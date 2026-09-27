import type { ReactNode } from 'react';

export type WrappedFactProps = {
  label: ReactNode;
  value: number | string;
  isHero?: boolean;
};
