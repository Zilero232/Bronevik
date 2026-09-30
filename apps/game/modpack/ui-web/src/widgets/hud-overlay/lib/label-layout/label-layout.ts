import type { HudPanel } from '../../../../shared/api/hud-protocol';
import type { Rect } from '../../../../shared/lib/hud-geometry';
import type { DockItem } from '../dock';
import type { DockItemInput, LabelLayout, LabelStyle, LabelStyleInput, LayoutLabelsInput, OpacityOfInput, ScaleOfInput } from './label-layout.types';

import { HUD_OVERLAY } from '../../config';
import { placeRect, rectStyle } from '../anchor';
import { settledPanels, stackDocks } from '../dock';

const scaleOf = ({ panel, scales }: ScaleOfInput): number => scales[panel.id] ?? panel.scale;

const dockItem = ({ panel, scale, sizes, overrides, screen }: DockItemInput): DockItem => {
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
};

const fullStatsArea = (screen: LayoutLabelsInput['screen']): Rect => {
  const { width, top, bottom } = HUD_OVERLAY.fullStats;

  return { left: (screen.width - width) / 2, top, width, height: screen.height - top - bottom };
};

const overlaps = (rect: Rect, other: Rect): boolean =>
  rect.left < other.left + other.width &&
  other.left < rect.left + rect.width &&
  rect.top < other.top + other.height &&
  other.top < rect.top + rect.height;

const opacityOf = ({ panel, rect, screen, settled }: OpacityOfInput): number => {
  if (!settled || !panel.visible) {
    return HUD_OVERLAY.hidden;
  }

  const isUnderFullStats = Boolean(panel.dim) && overlaps(rect, fullStatsArea(screen));

  return isUnderFullStats ? panel.alpha * HUD_OVERLAY.fullStats.alpha : panel.alpha;
};

export const labelStyle = ({ rect, scale, opacity }: LabelStyleInput): LabelStyle => {
  const style = { ...rectStyle({ rect }), opacity };

  if (scale === 1) {
    return style;
  }

  return { ...style, transform: `scale(${scale})`, transformOrigin: HUD_OVERLAY.scaleOrigin };
};

export const layoutLabels = (input: LayoutLabelsInput): LabelLayout[] => {
  const { panels, sizes, scales, screen, live, edit, widgets } = input;
  const items = panels.map((panel) => dockItem({ ...input, panel, scale: scaleOf({ panel, scales }) }));
  const stacked = stackDocks({ items, screen, ...HUD_OVERLAY.dock });
  const settled = settledPanels({ items, measured: (id) => sizes[id] !== undefined });

  const layoutOf = (panel: HudPanel): LabelLayout => {
    const scale = scaleOf({ panel, scales });
    const placed = stacked.get(panel.id) ?? HUD_OVERLAY.emptyRect;
    const rect = live?.id === panel.id ? live.rect : placed;
    const opacity = opacityOf({ panel, rect, screen, settled: settled.has(panel.id) });

    return {
      panel,
      id: panel.id,
      rect,
      scale,
      button: panel.visible && panel.kind === 'button',
      movable: panel.visible && edit && panel.drag,
      pointer: panel.visible && edit && Boolean(widgets.get(panel.id)?.pointer),
      style: labelStyle({ rect, scale, opacity })
    };
  };

  return panels.map(layoutOf);
};
