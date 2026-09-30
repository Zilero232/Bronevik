import { useEffect, useRef } from 'preact/hooks';

import type { UseEscapeLayerInput } from './use-escape-layer.types';

import { addEscapeLayer } from '../escape-stack';

export const useEscapeLayer = ({ kind, active = true, onEscape }: UseEscapeLayerInput): void => {
  const escapeRef = useRef(onEscape);

  escapeRef.current = onEscape;

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    return addEscapeLayer({ kind, onEscape: () => escapeRef.current() });
  }, [kind, active]);
};
