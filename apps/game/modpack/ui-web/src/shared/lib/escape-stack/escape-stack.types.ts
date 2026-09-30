import type { ESCAPE_LAYERS } from './escape-stack.constants';

export type EscapeLayerKind = keyof typeof ESCAPE_LAYERS;

export type EscapeLayer = {
  kind: EscapeLayerKind;
  onEscape: () => void;
};
