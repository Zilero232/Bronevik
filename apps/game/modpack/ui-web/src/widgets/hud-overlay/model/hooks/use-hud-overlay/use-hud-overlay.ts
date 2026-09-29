import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';

import type { ClientSize } from '../../../../../shared/api/gameface';
import type { HudState } from '../../../../../shared/api/hud-protocol';
import type { Measured } from '../../../lib/panel-size';
import type { HudLabelModel, LivePanel, OverlayDrag, Overrides, PanelPress, PanelWheel, Scales, Sizes } from './use-hud-overlay.types';

import { gameface } from '../../../../../shared/api/gameface';
import { parseHudState, sendHud } from '../../../../../shared/api/hud-protocol';
import { dragRect, placementOf } from '../../../../../shared/lib/hud-geometry';
import { designScreen, rootScale } from '../../../../../shared/lib/hud-screen';
import { parseRichText } from '../../../../../shared/lib/rich-text';
import { HUD_OVERLAY } from '../../../config';
import { placeRect, rectStyle } from '../../../lib/anchor';
import { sameSize, stickySize, wheelScale } from '../../../lib/panel-size';

const readScreen = (): ClientSize => {
  const scale = rootScale();
  const fallback =
    window.innerWidth > 0 && window.innerHeight > 0
      ? { width: window.innerWidth / scale, height: window.innerHeight / scale }
      : HUD_OVERLAY.defaultScreen;

  return designScreen({ client: gameface.clientSize(), scale, fallback });
};

const fitView = (): void => {
  const client = gameface.clientSize();

  if (client) {
    gameface.resizeView(client);
  }
};

const liveAt = (drag: OverlayDrag, event: PanelPress): LivePanel => ({
  id: drag.id,
  rect: dragRect({
    rect: drag.rect,
    dx: (event.clientX - drag.mouseX) / drag.scale,
    dy: (event.clientY - drag.mouseY) / drag.scale,
    screen: readScreen(),
    grid: HUD_OVERLAY.grid
  })
});

const beyondSlop = (drag: OverlayDrag, event: PanelPress): boolean =>
  Math.abs(event.clientX - drag.mouseX) > HUD_OVERLAY.clickSlop || Math.abs(event.clientY - drag.mouseY) > HUD_OVERLAY.clickSlop;

export const useHudOverlay = () => {
  const [state, setState] = useState<HudState | null>(null);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [scales, setScales] = useState<Scales>({});
  const [sizes, setSizes] = useState<Sizes>({});
  const [live, setLive] = useState<LivePanel | null>(null);
  const [screen, setScreen] = useState<ClientSize>(readScreen);
  const dragRef = useRef<OverlayDrag | null>(null);
  const lastRef = useRef<PanelPress | null>(null);
  const elementsRef = useRef(new Map<string, HTMLElement>());
  const measureRefsRef = useRef(new Map<string, (element: HTMLElement | null) => void>());
  const edit = Boolean(state?.edit);

  useEffect(() => {
    fitView();

    gameface.onDataChanged(() => {
      const next = parseHudState(gameface.state() ?? '');

      if (next) {
        setState(next);
        setOverrides({});
        setScales({});
      }
    });

    sendHud({ type: 'ready' });
  }, []);

  useEffect(() => {
    const check = (): void => {
      const next = readScreen();

      setScreen((current) => {
        if (current.width === next.width && current.height === next.height) {
          return current;
        }

        fitView();

        return next;
      });
    };

    const timer = setInterval(check, HUD_OVERLAY.screenCheckMs);

    window.addEventListener('resize', check);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', check);
    };
  }, []);

  const finish = (event: PanelPress): void => {
    const drag = dragRef.current;

    if (!drag) {
      return;
    }

    dragRef.current = null;
    lastRef.current = null;
    setLive(null);

    if (drag.button && !drag.moved && !beyondSlop(drag, event)) {
      sendHud({ type: 'pressed', id: drag.id });

      return;
    }

    const { rect } = liveAt(drag, event);
    const placement = placementOf({ rect, screen: readScreen() });

    setOverrides((current) => ({ ...current, [drag.id]: placement }));
    sendHud({ type: 'moved', id: drag.id, ...placement });
  };

  const finishRef = useRef(finish);

  finishRef.current = finish;

  useEffect(() => {
    const onMove = (event: MouseEvent): void => {
      const drag = dragRef.current;

      if (!drag) {
        return;
      }

      drag.moved = drag.moved || beyondSlop(drag, event);
      lastRef.current = { clientX: event.clientX, clientY: event.clientY };
      setLive(liveAt(drag, event));
    };

    const onUp = (event: MouseEvent): void => finishRef.current(event);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  useEffect(() => {
    const drag = dragRef.current;

    if (!edit && drag) {
      finishRef.current(lastRef.current ?? { clientX: drag.mouseX, clientY: drag.mouseY });
    }
  }, [edit]);

  const panels = useMemo(() => (state?.panels ?? []).filter((panel) => panel.visible), [state]);
  const lines = useMemo(() => new Map(panels.map((panel) => [panel.id, parseRichText(panel.text)])), [panels]);

  useLayoutEffect(() => {
    const scale = rootScale();
    const measured: Sizes = {};
    let changed = false;

    elementsRef.current.forEach((element, id) => {
      const next: Measured = { lines: lines.get(id)?.length ?? 0, width: element.offsetWidth / scale, height: element.offsetHeight / scale };
      const size = stickySize({ previous: sizes[id], next });

      measured[id] = size;
      changed = changed || !sameSize(sizes[id], size);
    });

    if (changed || Object.keys(sizes).length !== Object.keys(measured).length) {
      // eslint-disable-next-line react/set-state-in-effect -- the labels' sizes are only known after layout; it settles once nothing grows
      setSizes(measured);
    }
  }, [lines, sizes]);

  const measureRef = (id: string) => {
    const known = measureRefsRef.current.get(id);

    if (known) {
      return known;
    }

    const callback = (element: HTMLElement | null): void => {
      if (element) {
        elementsRef.current.set(id, element);
      } else {
        elementsRef.current.delete(id);
      }
    };

    measureRefsRef.current.set(id, callback);

    return callback;
  };

  const labels = panels.map((panel): HudLabelModel => {
    const scale = scales[panel.id] ?? panel.scale;
    const measured = sizes[panel.id];
    const size = { width: (measured?.width ?? 0) * scale, height: (measured?.height ?? 0) * scale };
    const rect = live?.id === panel.id ? live.rect : placeRect({ anchor: overrides[panel.id] ?? panel, size, screen });
    const button = panel.kind === 'button';
    const movable = edit && panel.drag;

    return {
      panel,
      lines: lines.get(panel.id) ?? [],
      style: {
        ...rectStyle({ rect }),
        opacity: measured ? panel.alpha : HUD_OVERLAY.hidden,
        ...(scale === 1 ? {} : { transform: `scale(${scale})`, transformOrigin: HUD_OVERLAY.scaleOrigin })
      },
      button,
      interactive: button || movable,
      framed: edit,
      dragging: live?.id === panel.id,
      measureRef: measureRef(panel.id),
      onMouseDown: ({ clientX, clientY }: PanelPress) => {
        if (!movable) {
          return;
        }

        dragRef.current = { id: panel.id, mouseX: clientX, mouseY: clientY, scale: rootScale(), rect: { ...rect, ...size }, moved: false, button };
        setLive({ id: panel.id, rect: { ...rect, ...size } });
      },
      onWheel: (event: PanelWheel) => {
        if (!edit) {
          return;
        }

        event.preventDefault();

        const next = wheelScale({ current: scale, deltaY: event.deltaY });

        if (next !== scale) {
          setScales((current) => ({ ...current, [panel.id]: next }));
          sendHud({ type: 'resized', id: panel.id, scale: next });
        }
      },
      onClick: () => {
        if (button && !edit) {
          sendHud({ type: 'pressed', id: panel.id });
        }
      }
    };
  });

  return {
    labels,
    edit,
    screen,
    style: { width: `${screen.width}${HUD_OVERLAY.unit}`, height: `${screen.height}${HUD_OVERLAY.unit}` }
  };
};
