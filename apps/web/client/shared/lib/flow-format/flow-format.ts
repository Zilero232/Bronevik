import type { Format } from '@number-flow/react';

export const flowFormat = (options: Intl.NumberFormatOptions | undefined): Format | undefined => {
  if (!options) {
    return undefined;
  }

  const { notation, ...rest } = options;

  return notation === 'scientific' || notation === 'engineering' ? rest : { ...rest, notation };
};
