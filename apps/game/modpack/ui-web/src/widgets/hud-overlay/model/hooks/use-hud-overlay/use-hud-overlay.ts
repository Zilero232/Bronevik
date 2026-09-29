import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

import type { HudState } from '../../../../../shared/api/hud-protocol';
import type { Rect } from '../../../../../shared/lib/hud-geometry';
import type { PanelPress } from '../use-panel-drag';
import type { HudLabelModel, Overrides, PanelWheel, Scales } from './use-hud-overlay.types';

import { gameface } from '../../../../../shared/api/gameface';
import { parseHudState, sendHud } from '../../../../../shared/api/hud-protocol';
import { parseRichText } from '../../../../../shared/lib/rich-text';
import { HUD_OVERLAY } from '../../../config';
import { placeRect, rectStyle } from '../../../lib/anchor';
import { inputAreaKey, inputAreaOf } from '../../../lib/input-area';
import { wheelScale } from '../../../lib/panel-size';
import { resolveWidget } from '../../../lib/widget-registry';
import { useHudScreen } from '../use-hud-screen';
import { usePanelDrag } from '../use-panel-drag';
import { usePanelSizes } from '../use-panel-sizes';

export const useHudOverlay = () => {
  const [state, setState] = useState<HudState | null>(null);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [scales, setScales] = useState<Scales>({});
  const screen = useHudScreen();
  const edit = Boolean(state?.edit);
  const { live, startDrag } = usePanelDrag({
    edit,
    onMoved: ({ id, placement }) => setOverrides((current) => ({ ...current, [id]: placement }))
  });

  const areaRef = useRef(inputAreaOf({ edit: false, screen, rects: [] }));

  useEffect(() => {
    gameface.fitView();

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

  const panels = useMemo(() => (state?.panels ?? []).filter((panel) => panel.visible), [state]);
  const lines = useMemo(() => new Map(panels.map((panel) => [panel.id, parseRichText(panel.text)])), [panels]);
  const widgets = useMemo(() => new Map(panels.map((panel) => [panel.id, resolveWidget(panel.widget)])), [panels]);
  const { sizes, measureRef } = usePanelSizes({ lines, widgets });

  const clickable: Rect[] = [];

  const labels = panels.map((panel): HudLabelModel => {
    const scale = scales[panel.id] ?? panel.scale;
    const measured = sizes[panel.id];
    const size = { width: (measured?.width ?? 0) * scale, height: (measured?.height ?? 0) * scale };
    const rect = live?.id === panel.id ? live.rect : placeRect({ anchor: overrides[panel.id] ?? panel, size, screen });
    const button = panel.kind === 'button';
    const movable = edit && panel.drag;

    if (button) {
      clickable.push({ ...rect, ...size });
    }

    return {
      panel,
      lines: lines.get(panel.id) ?? [],
      widget: widgets.get(panel.id) ?? null,
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
      onMouseDown: (press: PanelPress) => {
        if (movable) {
          startDrag({ id: panel.id, press, rect: { ...rect, ...size }, button });
        }
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

  areaRef.current = inputAreaOf({ edit, screen, rects: clickable });

  const areaKey = inputAreaKey(areaRef.current);

  useEffect(() => {
    gameface.setInputArea(areaRef.current);
  }, [areaKey]);

  return {
    labels,
    edit,
    screen,
    style: { width: `${screen.width}${HUD_OVERLAY.unit}`, height: `${screen.height}${HUD_OVERLAY.unit}` }
  };
};
