import { useEffect, useRef, useState } from 'preact/hooks';

import type { UseInputAreaInput } from './use-input-area.types';

import { gameface } from '../../../../../shared/api/gameface';
import { rootScale } from '../../../../../shared/lib/hud-screen';
import { HUD_OVERLAY } from '../../../config';
import { hitPanel, pointerPoint } from '../../../lib/hit-panel';
import { inputAreaKey, inputAreaOf } from '../../../lib/input-area';

export const useInputArea = ({ edit, hover, dragging, screen, clickable, targets, report }: UseInputAreaInput): void => {
  const [hovered, setHovered] = useState<string | null>(null);
  const tracking = edit && hover;
  const latestRef = useRef({ targets, report });

  latestRef.current = { targets, report };

  useEffect(() => {
    if (!tracking) {
      return;
    }

    const poll = (): void => {
      const position = gameface.mousePosition();
      const point = position && pointerPoint({ clientX: position.x, clientY: position.y, scale: rootScale() });
      const target = point && hitPanel({ targets: latestRef.current.targets, point, pointer: true });

      setHovered(target ? target.id : null);

      if (target) {
        latestRef.current.report('hover');
      }
    };

    const timer = setInterval(poll, HUD_OVERLAY.hoverPollMs);

    return () => clearInterval(timer);
  }, [tracking]);

  const hoveredRect = tracking ? targets.find((target) => target.id === hovered)?.rect : undefined;
  const area = inputAreaOf({ whole: edit && (!hover || dragging), screen, rects: hoveredRect ? [...clickable, hoveredRect] : clickable });
  const areaRef = useRef(area);
  const key = inputAreaKey(area);

  areaRef.current = area;

  useEffect(() => {
    gameface.setInputArea(areaRef.current);
  }, [key]);
};
