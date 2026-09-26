import type { ComponentProps } from 'react';

export type BandTone = 'deep' | 'raised';

export type BandProps = Omit<ComponentProps<'section'>, 'ref'> & {
  tone?: BandTone;
  width?: 'narrow' | 'wide';
  isDark?: boolean;
  as?: 'div' | 'section';
  innerClassName?: string;
};
