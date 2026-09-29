import type { ComponentProps } from 'react';

type BandTone = 'deep' | 'raised';

type BandTexture = 'camo' | 'hex' | 'noise' | 'none';

export type BandProps = Omit<ComponentProps<'section'>, 'ref'> & {
  tone?: BandTone;
  width?: 'full' | 'wide';
  texture?: BandTexture;
  isDark?: boolean;
  as?: 'div' | 'section';
  innerClassName?: string;
};
