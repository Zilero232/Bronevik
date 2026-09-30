import { clamp } from 'remeda';

import type { ClampFrameInput, FitFrameInput, Frame, FrameLayout, LayoutInput, MoveFrameInput, ResizeFrameInput, ZoomStepInput } from './frame.types';

import { WINDOW_FRAME } from '../../config';

export const clampFrame = ({ frame, screen }: ClampFrameInput): Frame => {
  const width = clamp(frame.width, { min: Math.min(WINDOW_FRAME.minSize.width, screen.width), max: screen.width });
  const height = clamp(frame.height, { min: Math.min(WINDOW_FRAME.minSize.height, screen.height), max: screen.height });

  return {
    x: clamp(frame.x, { min: 0, max: Math.max(screen.width - width, 0) }),
    y: clamp(frame.y, { min: 0, max: Math.max(screen.height - height, 0) }),
    width,
    height
  };
};

export const centredFrame = (screen: FitFrameInput['screen']): Frame => {
  const width = Math.min(WINDOW_FRAME.defaultSize.width, screen.width - WINDOW_FRAME.margin * 2);
  const height = Math.min(WINDOW_FRAME.defaultSize.height, screen.height - WINDOW_FRAME.margin * 2);
  const frame = clampFrame({ frame: { x: 0, y: 0, width, height }, screen });

  return { ...frame, x: Math.round((screen.width - frame.width) / 2), y: Math.round((screen.height - frame.height) / 2) };
};

export const fitFrame = ({ saved, screen }: FitFrameInput): Frame => {
  if (!saved.placed || saved.width <= 0 || saved.height <= 0) {
    return centredFrame(screen);
  }

  return clampFrame({ frame: { x: saved.x, y: saved.y, width: saved.width, height: saved.height }, screen });
};

export const moveFrame = ({ frame, dx, dy, screen }: MoveFrameInput): Frame =>
  clampFrame({ frame: { ...frame, x: frame.x + dx, y: frame.y + dy }, screen });

export const resizeFrame = ({ frame, dx, dy, edge, screen }: ResizeFrameInput): Frame => {
  const width = edge === 'bottom' ? frame.width : Math.min(frame.width + dx, screen.width - frame.x);
  const height = edge === 'right' ? frame.height : Math.min(frame.height + dy, screen.height - frame.y);

  return clampFrame({ frame: { ...frame, width, height }, screen });
};

export const zoomStep = ({ zoom, direction }: ZoomStepInput): number => {
  const steps: readonly number[] = WINDOW_FRAME.zoomSteps;
  const index = steps.findIndex((step) => step >= zoom);
  const current = index === -1 ? steps.length - 1 : index;
  const exact = steps[current] === zoom;
  const next = direction > 0 ? (exact ? current + 1 : current) : current - 1;

  return steps[clamp(next, { min: 0, max: steps.length - 1 })] ?? WINDOW_FRAME.defaultZoom;
};

export const layoutOf = ({ frame, zoom }: LayoutInput): FrameLayout => {
  const scale = zoom / WINDOW_FRAME.percent;
  const inner = { width: frame.width / scale, height: frame.height / scale };

  return {
    inner,
    scale,
    compactNav: inner.width < WINDOW_FRAME.compactNavWidth,
    columns: inner.width >= WINDOW_FRAME.twoColumnsWidth ? 2 : 1
  };
};

export const toRem = (value: number): string => `${Math.round(value * 100) / 100}rem`;
