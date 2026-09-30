import { useEffect, useEffectEvent, useState } from 'react';

import type { UseHoveredPanelInput } from './use-hovered-panel.types';

import { gameface } from '../../../../../shared/api/gameface';
import { rootScale } from '../../../../../shared/lib/hud-screen';
import { HUD_OVERLAY } from '../../../config';
import { panelUnder, pointerPoint } from '../../../lib/hit-panel';

const hoveredId = ({ targets }: Pick<UseHoveredPanelInput, 'targets'>): string | null => {
  const position = gameface.mousePosition();

  if (!position) {
    return null;
  }

  const point = pointerPoint({ clientX: position.x, clientY: position.y, scale: rootScale() });

  return panelUnder({ targets, point })?.id ?? null;
};

export const useHoveredPanel = ({ active, targets }: UseHoveredPanelInput): string | null => {
  const [hovered, setHovered] = useState<string | null>(null);
  const poll = useEffectEvent(() => setHovered(hoveredId({ targets })));

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const timer = setInterval(poll, HUD_OVERLAY.hoverPollMs);

    return () => {
      clearInterval(timer);
      setHovered(null);
    };
  }, [active]);

  return active ? hovered : null;
};
