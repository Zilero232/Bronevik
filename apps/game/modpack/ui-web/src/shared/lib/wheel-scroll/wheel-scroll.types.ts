export type WheelScrollInput = {
  top: number;
  deltaY: number;
  max: number;
  step: number;
};

export type ScrollMetrics = {
  top: number;
  content: number;
  viewport: number;
};

export type ThumbInput = ScrollMetrics & {
  minThumb: number;
};

export type Thumb = {
  visible: boolean;
  size: number;
  offset: number;
};

export type TopFromThumbInput = ScrollMetrics & {
  offset: number;
  size: number;
};

export type WheelDelta = Pick<WheelEvent, 'deltaY'> & {
  wheelDelta?: number;
  wheelDeltaY?: number;
};

export type WheelLike = WheelDelta & Pick<WheelEvent, 'preventDefault' | 'stopPropagation'>;

export type ScrollBox = Pick<HTMLElement, 'clientHeight' | 'scrollHeight' | 'scrollTop'>;

export type ScrollByWheelInput = {
  element: ScrollBox;
  event: WheelLike;
  step?: number;
};

export type WheelRoot = Pick<Document, 'addEventListener' | 'removeEventListener'>;

export type BindWheelScrollInput = {
  element: HTMLElement;
  onScrolled?: () => void;
};
