export type ThumbPress = Pick<MouseEvent, 'clientY' | 'preventDefault' | 'stopPropagation'>;

export type ThumbDrag = {
  startY: number;
  startOffset: number;
  factor: number;
};
