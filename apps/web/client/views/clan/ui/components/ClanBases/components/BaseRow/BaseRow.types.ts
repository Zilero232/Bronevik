import type { ReactNode } from 'react';

export type BaseRowProps = {
  label: ReactNode;
  isMuted?: boolean;
  children: ReactNode;
};
