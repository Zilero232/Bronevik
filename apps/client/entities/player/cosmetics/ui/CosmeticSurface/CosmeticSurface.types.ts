import type { ReactNode } from 'react';

export type CosmeticSurfaceProps = {
  banner: string | null;
  frame: string | null;
  children: ReactNode;
  className?: string;
};
