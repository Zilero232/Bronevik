import type { EscapeLayer } from './escape-stack.types';

import { ESCAPE_LAYERS } from './escape-stack.constants';

const layers: EscapeLayer[] = [];

const outranks = (layer: EscapeLayer, current: EscapeLayer | null): boolean =>
  current === null || ESCAPE_LAYERS[layer.kind] >= ESCAPE_LAYERS[current.kind];

export const addEscapeLayer = (layer: EscapeLayer): (() => void) => {
  layers.push(layer);

  return () => {
    const index = layers.indexOf(layer);

    if (index >= 0) {
      layers.splice(index, 1);
    }
  };
};

export const stepBack = (): boolean => {
  const top = layers.reduce<EscapeLayer | null>((current, layer) => (outranks(layer, current) ? layer : current), null);

  if (top === null) {
    return false;
  }

  top.onEscape();

  return true;
};
