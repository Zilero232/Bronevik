import type { ReactNode } from 'react';

export type ArmorHeaderProps = {
  slug: string;
  name?: string;
  version?: string;
  client?: string;
  children?: ReactNode;
};
