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

export type WheelLike = Pick<WheelEvent, 'deltaY' | 'preventDefault' | 'stopPropagation'>;

export type ScrollByWheelInput = {
  element: Pick<HTMLElement, 'clientHeight' | 'scrollHeight' | 'scrollTop'>;
  event: WheelLike;
};

export type WheelTarget = Pick<HTMLElement, 'clientHeight' | 'hasAttribute' | 'parentElement' | 'scrollHeight' | 'scrollTop'>;

export type WheelTargetInput = {
  start: Element | null;
  deltaY: number;
};
