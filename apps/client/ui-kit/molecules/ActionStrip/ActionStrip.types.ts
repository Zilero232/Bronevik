import type { ComponentProps, ReactNode } from 'react';

export type ActionStripLink = {
  id: string;
  href: string;
  label: string;
  icon: ReactNode;
};

export type ActionStripProps = Omit<ComponentProps<'div'>, 'ref'> & {
  as?: 'div' | 'nav' | 'section';
  links?: readonly ActionStripLink[];
  start?: ReactNode;
  end?: ReactNode;
  width?: 'narrow' | 'wide';
  align?: 'bottom' | 'center';
  innerClassName?: string;
};
