import type { ComponentProps } from 'react';

export type BandTone = 'deep' | 'raised';

export type BandTexture = 'camo' | 'hex' | 'noise' | 'none';

export type BandProps = Omit<ComponentProps<'section'>, 'ref'> & {
  tone?: BandTone;
  width?: 'full' | 'narrow' | 'wide';
  texture?: BandTexture;
  isDark?: boolean;
  as?: 'div' | 'section';
  innerClassName?: string;
};
