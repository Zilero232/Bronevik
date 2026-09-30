import type { ClientSize } from '../../../../shared/api/gameface';
import type { UiWindow } from '../../../../shared/api/protocol';
import type { RESIZE_EDGE } from '../../config';

export type Frame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ResizeEdge = (typeof RESIZE_EDGE)[keyof typeof RESIZE_EDGE];

export type FitFrameInput = {
  saved: UiWindow;
  screen: ClientSize;
};

export type ClampFrameInput = {
  frame: Frame;
  screen: ClientSize;
};

export type MoveFrameInput = ClampFrameInput & {
  dx: number;
  dy: number;
};

export type ResizeFrameInput = MoveFrameInput & {
  edge: ResizeEdge;
};

export type ZoomStepInput = {
  zoom: number;
  direction: -1 | 1;
};

export type LayoutInput = {
  frame: Frame;
  zoom: number;
};

export type FrameLayout = {
  inner: ClientSize;
  scale: number;
  compactNav: boolean;
  columns: 1 | 2;
};
