import type { ReactNode } from 'react';

export type MountOnceInput = {
  id: string;
  node: ReactNode;
};

export type Unmount = () => void;
