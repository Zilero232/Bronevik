'use client';

import { BOARD_LIMITS } from '../../../config';
import { canAddLayer } from '../../../lib/layer-ops';
import { useWorkspace } from '../../context';

export const useLayersPanel = () => {
  const { layers, activeLayer, isEditable, onAddLayer } = useWorkspace();

  return {
    layers,
    activeLayerId: activeLayer?.id ?? null,
    isEditable,
    canAdd: isEditable && canAddLayer(layers),
    max: BOARD_LIMITS.layers,
    onAddLayer
  };
};
