import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

import type { HudPanel, HudState } from '../../../../../shared/api/hud-protocol';
import type { Rect } from '../../../../../shared/lib/hud-geometry';
import type { RichLine } from '../../../../../shared/lib/rich-text';
import type { ResolvedWidget } from '../../../lib/widget-registry';
import type { DragTarget } from '../use-panel-drag';
import type { HudLabelModel, Overrides, Scales } from './use-hud-overlay.types';

import { gameface } from '../../../../../shared/api/gameface';
import { parseHudState, sendHud } from '../../../../../shared/api/hud-protocol';
import { fontSafeLines } from '../../../../../shared/lib/font-safe';
import { onDistinct } from '../../../../../shared/lib/on-distinct';
import { parseRichText } from '../../../../../shared/lib/rich-text';
import { HUD_OVERLAY } from '../../../config';
import { placeRect, rectStyle } from '../../../lib/anchor';
import { settledPanels, stackDocks } from '../../../lib/dock';
import { createMouseReport } from '../../../lib/mouse-report';
import { clearedRecord, remember, sharePanels } from '../../../lib/share-panels';
import { resolveWidget } from '../../../lib/widget-registry';
import { useHudScreen } from '../use-hud-screen';
import { useInputArea } from '../use-input-area';
import { usePanelDrag } from '../use-panel-drag';
import { usePanelSizes } from '../use-panel-sizes';

export const useHudOverlay = () => {
  const [state, setState] = useState<HudState | null>(null);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [scales, setScales] = useState<Scales>({});
  const screen = useHudScreen();
  const edit = Boolean(state?.edit);
  const targetsRef = useRef<DragTarget[]>([]);
  const [report] = useState(createMouseReport);
  const { live } = usePanelDrag({
    edit,
    report,
    targets: () => targetsRef.current,
    onMoved: ({ id, placement }) => setOverrides((current) => ({ ...current, [id]: placement })),
    onScaled: ({ id, scale }) => setScales((current) => ({ ...current, [id]: scale }))
  });

  useEffect(() => {
    gameface.fitView();

    const take = onDistinct((raw: string | null) => {
      const next = parseHudState(raw ?? '');

      if (next) {
        setState((previous) => sharePanels({ previous, next }));
        setOverrides(clearedRecord);
        setScales(clearedRecord);
      }
    });

    gameface.onDataChanged(() => take(gameface.state()));

    sendHud({ type: 'ready' });
  }, []);

  const linesCacheRef = useRef(new WeakMap<HudPanel, RichLine[]>());
  const widgetsCacheRef = useRef(new WeakMap<HudPanel, ResolvedWidget | null>());
  const panels = useMemo(() => (state?.panels ?? []).filter((panel) => panel.visible), [state]);
  const lines = useMemo(
    () =>
      new Map(
        panels.map((panel) => [panel.id, remember({ cache: linesCacheRef.current, panel, build: () => fontSafeLines(parseRichText(panel.text)) })])
      ),
    [panels]
  );

  const widgets = useMemo(
    () => new Map(panels.map((panel) => [panel.id, remember({ cache: widgetsCacheRef.current, panel, build: () => resolveWidget(panel.widget) })])),
    [panels]
  );

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
  const settled = settledPanels({ items: base, measured: (id) => sizes[id] !== undefined });

  const labels = panels.map((panel): HudLabelModel => {
    const scale = scaleOf(panel.id, panel.scale);
    const placed = stacked.get(panel.id) ?? { left: 0, top: 0, width: 0, height: 0 };
    const rect = live?.id === panel.id ? live.rect : placed;
    const button = panel.kind === 'button';
    const movable = edit && panel.drag;
    const pointer = edit && Boolean(widgets.get(panel.id)?.pointer);

    if (button) {
      clickable.push(rect);
    }

    targets.push({ id: panel.id, rect, button, movable, pointer, scale });

    return {
      panel,
      lines: lines.get(panel.id) ?? [],
      widget: widgets.get(panel.id) ?? null,
      style: {
        ...rectStyle({ rect }),
        opacity: settled.has(panel.id) ? panel.alpha : HUD_OVERLAY.hidden,
        ...(scale === 1 ? {} : { transform: `scale(${scale})`, transformOrigin: HUD_OVERLAY.scaleOrigin })
      },
      button,
      interactive: button || movable || pointer,
      framed: movable,
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
  useInputArea({ edit, hover: Boolean(state?.hover), dragging: live !== null, screen, clickable, targets, report });

  return {
    labels,
    edit,
    screen,
    style: { width: `${screen.width}${HUD_OVERLAY.unit}`, height: `${screen.height}${HUD_OVERLAY.unit}` }
  };
};
