import { useEffect, useEffectEvent } from 'react';

import type { UseEscapeLayerInput } from './use-escape-layer.types';

import { addEscapeLayer } from '../escape-stack';

export const useEscapeLayer = ({ kind, active = true, onEscape }: UseEscapeLayerInput): void => {
  const escape = useEffectEvent(onEscape);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    return addEscapeLayer({ kind, onEscape: () => escape() });
  }, [kind, active]);
};
