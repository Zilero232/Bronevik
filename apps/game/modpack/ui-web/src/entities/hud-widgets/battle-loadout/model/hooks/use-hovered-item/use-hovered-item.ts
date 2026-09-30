import { useEffect, useState } from 'preact/hooks';

import type { HoveredItemHandlers } from './use-hovered-item.types';

import { useHudPointer } from '../../../../../../shared/lib/hud-pointer';

export const useHoveredItem = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const pointer = useHudPointer();

  useEffect(() => {
    if (!pointer) {
      // eslint-disable-next-line react/set-state-in-effect -- the panel stops taking the mouse when the battle cursor hides, and no mouseleave follows
      setHovered(null);
    }
  }, [pointer]);

  const handlers = (index: number): HoveredItemHandlers => ({
    onMouseEnter: () => setHovered(index),
    onMouseLeave: () => setHovered((current) => (current === index ? null : current))
  });

  return { hovered: pointer ? hovered : null, handlers };
};
