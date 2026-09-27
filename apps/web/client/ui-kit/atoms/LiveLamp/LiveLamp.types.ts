import type { ReactNode } from 'react';

export type LiveLampProps = {
  label: ReactNode;
  isLive?: boolean;
  size?: 'md' | 'sm';
  className?: string;
};
