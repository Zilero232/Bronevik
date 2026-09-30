import type { RefObject } from 'preact';

import type { Frame, Viewport } from '../../../lib/frame';
import type { GestureKind } from '../../../lib/hit';

export type Pointer = Pick<MouseEvent, 'clientX' | 'clientY'>;

export type Gesture = {
  kind: GestureKind;
  startX: number;
  startY: number;
  frame: Frame;
  last: Frame;
};

export type Handles = Record<GestureKind, RefObject<HTMLDivElement>>;

export type UseFrameGestureInput = {
  frame: Frame;
  viewport: Viewport;
  onChange: (frame: Frame) => void;
  onDone: (frame: Frame) => void;
};
