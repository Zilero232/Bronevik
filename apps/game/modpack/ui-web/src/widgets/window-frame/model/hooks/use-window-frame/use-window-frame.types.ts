import type { Frame, ResizeEdge } from '../../../lib/frame';

export type Pointer = Pick<MouseEvent, 'clientX' | 'clientY'>;

export type FramePress = Pointer & Pick<MouseEvent, 'preventDefault'>;

export type Gesture = {
  kind: 'move' | ResizeEdge;
  startX: number;
  startY: number;
  frame: Frame;
};

export type PersistInput = {
  frame: Frame;
  zoom: number;
  placed?: boolean;
};
