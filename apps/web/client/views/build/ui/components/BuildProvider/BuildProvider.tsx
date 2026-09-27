'use client';

import type { BuildProviderProps } from './BuildProvider.types';

import { BuildContext } from '../../../model/context';
import { useBuildState } from '../../../model/hooks';

export const BuildProvider = ({ vehicle, options, children }: BuildProviderProps) => {
  const value = useBuildState({ vehicle, options });

  return <BuildContext value={value}>{children}</BuildContext>;
};
