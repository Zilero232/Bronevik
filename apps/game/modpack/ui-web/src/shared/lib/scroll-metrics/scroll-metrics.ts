import type { ScrollBox, ScrollMetrics } from './scroll-metrics.types';

const measured = (value: number | undefined): value is number => typeof value === 'number' && Number.isFinite(value);

const childrenSpan = (box: ScrollBox): number => {
  const children = [...box.children].filter((child): child is HTMLElement => child instanceof HTMLElement);
  const first = children[0];
  const last = children[children.length - 1];

  return first && last ? last.offsetTop + last.offsetHeight - first.offsetTop : 0;
};

const viewportOf = (box: ScrollBox): number => {
  if (measured(box.clientHeight)) {
    return box.clientHeight;
  }

  return measured(box.offsetHeight) ? box.offsetHeight : 0;
};

const contentOf = (box: ScrollBox): number => (measured(box.scrollHeight) ? box.scrollHeight : childrenSpan(box));

export const scrollMetricsOf = (box: ScrollBox): ScrollMetrics => ({
  top: measured(box.scrollTop) ? box.scrollTop : 0,
  content: contentOf(box),
  viewport: viewportOf(box)
});

export const scrollMaxOf = (box: ScrollBox): number => {
  const { content, viewport } = scrollMetricsOf(box);

  return Math.max(content - viewport, 0);
};
