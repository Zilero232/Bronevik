import type { RefObject } from 'preact';

import type { Frame, Viewport } from '../../../lib/frame';
import type { GestureKind } from '../../../lib/hit';

export type Handles = Record<GestureKind, RefObject<HTMLDivElement>>;

export type UseFrameGestureInput = {
  frame: Frame;
  viewport: Viewport;
  onChange: (frame: Frame) => void;
  onDone: (frame: Frame) => void;
};
