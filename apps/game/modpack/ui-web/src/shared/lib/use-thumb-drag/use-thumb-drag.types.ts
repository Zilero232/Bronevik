import type { RefObject } from 'react';

export type ThumbPress = Pick<MouseEvent, 'clientY' | 'preventDefault' | 'stopPropagation'>;

export type ThumbDrag = {
  startY: number;
  startOffset: number;
  factor: number;
};

export type UseThumbDragInput = {
  viewportRef: RefObject<HTMLElement | null>;
  visible: boolean;
  onDragged: () => void;
};

export type DragOfInput = { element: HTMLElement; clientY: number };
