import type { EscapeLayerKind } from '../escape-stack';

export type UseEscapeLayerInput = {
  kind: EscapeLayerKind;
  active?: boolean;
  onEscape: () => void;
};
