export type ScrollMetrics = {
  top: number;
  content: number;
  viewport: number;
};

export type ScrollBox = Pick<HTMLElement, 'children' | 'clientHeight' | 'offsetHeight' | 'scrollHeight' | 'scrollTop'>;
