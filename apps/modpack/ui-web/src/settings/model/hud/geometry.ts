import type { AnchorInput, DragInput, PanelRectInput, Placement, Rect, RectOnScreen, ScaleInput, ThirdInput } from './geometry.types';

const anchorOffset = ({ align, size, extent }: AnchorInput): number => {
  if (align === 'left' || align === 'top') {
    return 0;
  }

  if (align === 'center') {
    return (extent - size) / 2;
  }

  return extent - size;
};

const third = ({ center, extent }: ThirdInput): 0 | 1 | 2 => {
  if (center < extent / 3) {
    return 0;
  }

  return center > (extent * 2) / 3 ? 2 : 1;
};

const ALIGN_X = ['left', 'center', 'right'] as const;
const ALIGN_Y = ['top', 'center', 'bottom'] as const;

export const panelRect = ({ panel, screen }: PanelRectInput): Rect => ({
  left: anchorOffset({ align: panel.align_x, size: panel.width, extent: screen.width }) + panel.x,
  top: anchorOffset({ align: panel.align_y, size: panel.height, extent: screen.height }) + panel.y,
  width: panel.width,
  height: panel.height
});

export const clampRect = ({ rect, screen }: RectOnScreen): Rect => ({
  ...rect,
  left: Math.min(Math.max(rect.left, 0), Math.max(screen.width - rect.width, 0)),
  top: Math.min(Math.max(rect.top, 0), Math.max(screen.height - rect.height, 0))
});

export const dragRect = ({ rect, dx, dy, screen, grid }: DragInput): Rect => {
  const snap = (value: number): number => (grid > 1 ? Math.round(value / grid) * grid : Math.round(value));

  return clampRect({ rect: { ...rect, left: snap(rect.left + dx), top: snap(rect.top + dy) }, screen });
};

export const placementOf = ({ rect, screen }: RectOnScreen): Placement => {
  const alignX = ALIGN_X[third({ center: rect.left + rect.width / 2, extent: screen.width })];
  const alignY = ALIGN_Y[third({ center: rect.top + rect.height / 2, extent: screen.height })];

  return {
    x: Math.round(rect.left - anchorOffset({ align: alignX, size: rect.width, extent: screen.width })),
    y: Math.round(rect.top - anchorOffset({ align: alignY, size: rect.height, extent: screen.height })),
    align_x: alignX,
    align_y: alignY
  };
};

export const stageScale = ({ screen, stage }: ScaleInput): number =>
  Math.min(stage.width / Math.max(screen.width, 1), stage.height / Math.max(screen.height, 1));
