import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

import type { HudState } from '../../../../../shared/api/hud-protocol';
import type { HudLabelModel, LivePanel, OverlayDrag, Overrides, PanelPress } from './use-hud-overlay.types';

import { gameface } from '../../../../../shared/api/gameface';
import { parseHudState, sendHud } from '../../../../../shared/api/hud-protocol';
import { dragRect, placementOf } from '../../../../../shared/lib/hud-geometry';
import { parseRichText } from '../../../../../shared/lib/rich-text';
import { HUD_OVERLAY } from '../../../config';
import { anchorStyle, designRect, designSize, rectStyle, rootScale } from '../../../lib/anchor';

const pageScale = (): number => rootScale(getComputedStyle(document.documentElement).fontSize);

const pageSize = (scale: number) => designSize({ width: window.innerWidth, height: window.innerHeight, scale });

const liveAt = (drag: OverlayDrag, event: Pick<MouseEvent, 'clientX' | 'clientY'>): LivePanel => ({
  id: drag.id,
  rect: dragRect({
    rect: drag.rect,
    dx: (event.clientX - drag.mouseX) / drag.scale,
    dy: (event.clientY - drag.mouseY) / drag.scale,
    screen: pageSize(drag.scale),
    grid: HUD_OVERLAY.grid
  })
});

export const useHudOverlay = () => {
  const [state, setState] = useState<HudState | null>(null);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [live, setLive] = useState<LivePanel | null>(null);
  const dragRef = useRef<OverlayDrag | null>(null);

  useEffect(() => {
    gameface.onDataChanged(() => {
      const next = parseHudState(gameface.state() ?? '');

      if (next) {
        setState(next);
        setOverrides({});
      }
    });

    sendHud({ type: 'ready' });
  }, []);

  useEffect(() => {
    const onMove = (event: MouseEvent): void => {
      if (dragRef.current) {
        setLive(liveAt(dragRef.current, event));
      }
    };

    const onUp = (event: MouseEvent): void => {
      const drag = dragRef.current;

      if (!drag) {
        return;
      }

      const { rect } = liveAt(drag, event);
      const placement = placementOf({ rect, screen: pageSize(drag.scale) });

      dragRef.current = null;
      setLive(null);
      setOverrides((current) => ({ ...current, [drag.id]: placement }));
      sendHud({ type: 'moved', id: drag.id, ...placement });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const labels = useMemo(
    (): HudLabelModel[] =>
      (state?.panels ?? [])
        .filter((panel) => panel.visible)
        .map((panel) => {
          const draggable = Boolean(state?.cursor) && panel.drag;
          const place = live?.id === panel.id ? rectStyle({ rect: live.rect }) : anchorStyle(overrides[panel.id] ?? panel);

          return {
            panel,
            lines: parseRichText(panel.text),
            style: { ...place, opacity: panel.alpha },
            draggable,
            dragging: live?.id === panel.id,
            onMouseDown: ({ clientX, clientY, currentTarget }: PanelPress) => {
              if (!draggable || !(currentTarget instanceof Element)) {
                return;
              }

              const scale = pageScale();
              const rect = designRect({ box: currentTarget.getBoundingClientRect(), scale });

              dragRef.current = { id: panel.id, mouseX: clientX, mouseY: clientY, scale, rect };
              setLive({ id: panel.id, rect });
            }
          };
        }),
    [state, overrides, live]
  );

  return { labels, cursor: Boolean(state?.cursor) };
};
