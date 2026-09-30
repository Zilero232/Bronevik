import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

import type { HudState } from '../../../../../shared/api/hud-protocol';
import type { Rect } from '../../../../../shared/lib/hud-geometry';
import type { DragTarget } from '../use-panel-drag';
import type { HudLabelModel, Overrides, Scales } from './use-hud-overlay.types';

import { gameface } from '../../../../../shared/api/gameface';
import { parseHudState, sendHud } from '../../../../../shared/api/hud-protocol';
import { fontSafeLines } from '../../../../../shared/lib/font-safe';
import { parseRichText } from '../../../../../shared/lib/rich-text';
import { HUD_OVERLAY } from '../../../config';
import { placeRect, rectStyle } from '../../../lib/anchor';
import { stackDocks } from '../../../lib/dock';
import { inputAreaKey, inputAreaOf } from '../../../lib/input-area';
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
  const targetsRef = useRef<DragTarget[]>([]);
  const { live } = usePanelDrag({
    edit,
    targets: () => targetsRef.current,
    onMoved: ({ id, placement }) => setOverrides((current) => ({ ...current, [id]: placement })),
    onScaled: ({ id, scale }) => setScales((current) => ({ ...current, [id]: scale }))
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
  const lines = useMemo(() => new Map(panels.map((panel) => [panel.id, fontSafeLines(parseRichText(panel.text))])), [panels]);
  const widgets = useMemo(() => new Map(panels.map((panel) => [panel.id, resolveWidget(panel.widget)])), [panels]);
  const { sizes, measureRef } = usePanelSizes({ lines, widgets });

  const clickable: Rect[] = [];
  const targets: DragTarget[] = [];
  const scaleOf = (id: string, fallback: number): number => scales[id] ?? fallback;

  const base = panels.map((panel) => {
    const scale = scaleOf(panel.id, panel.scale);
    const measured = sizes[panel.id];
    const size = { width: (measured?.width ?? 0) * scale, height: (measured?.height ?? 0) * scale };
    const override = overrides[panel.id];

    return {
      id: panel.id,
      dock: override ? null : (panel.dock ?? null),
      upward: panel.align_y === 'bottom',
      align: panel.align_x,
      rect: placeRect({ anchor: override ?? panel, size, screen })
    };
  });

  const stacked = stackDocks({ items: base, screen, ...HUD_OVERLAY.dock });

  const labels = panels.map((panel): HudLabelModel => {
    const scale = scaleOf(panel.id, panel.scale);
    const measured = sizes[panel.id];
    const placed = stacked.get(panel.id) ?? { left: 0, top: 0, width: 0, height: 0 };
    const rect = live?.id === panel.id ? live.rect : placed;
    const button = panel.kind === 'button';
    const movable = edit && panel.drag;

    if (button) {
      clickable.push(rect);
    }

    targets.push({ id: panel.id, rect, button, movable, scale });

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
      onClick: () => {
        if (button && !edit) {
          sendHud({ type: 'pressed', id: panel.id });
        }
      }
    };
  });

  targetsRef.current = targets;
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
