export type SmoothScrollInput = {
  element: Pick<HTMLElement, 'scrollTop'>;
  onFrame?: () => void;
};

export type SmoothScroll = {
  target: () => number;
  scrollTo: (top: number) => boolean;
};

export type Glide = {
  from: number;
  to: number;
  startedAt: number | null;
  written: number;
};
