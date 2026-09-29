import type { ComponentProps, ReactNode } from 'react';

import type { ProgressTone } from '../../atoms';

type ActionStripLink = {
  id: string;
  href: string;
  label: string;
  icon: ReactNode;
  hint?: string;
  tone?: ProgressTone;
};

export type ActionStripProps = Omit<ComponentProps<'div'>, 'ref'> & {
  as?: 'div' | 'nav' | 'section';
  links?: readonly ActionStripLink[];
  start?: ReactNode;
  end?: ReactNode;
  align?: 'bottom' | 'center';
  variant?: 'chips' | 'tiles';
  innerClassName?: string;
};
