// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { scrollMaxOf, scrollMetricsOf } from '../scroll-metrics';

type Measure = { scrollHeight?: number; clientHeight?: number; offsetHeight?: number };

const measured = <T extends HTMLElement>(element: T, values: Record<string, number | undefined>): T => {
  Object.entries(values).forEach(([name, value]) => Object.defineProperty(element, name, { value }));

  return element;
};

const row = ({ top, height }: { top: number; height: number }): HTMLDivElement =>
  measured(document.createElement('div'), { offsetTop: top, offsetHeight: height });

const box = ({ scrollHeight, clientHeight, offsetHeight = 500 }: Measure): HTMLDivElement => {
  const element = measured(document.createElement('div'), { scrollHeight, clientHeight, offsetHeight });

  element.append(row({ top: 10, height: 900 }), row({ top: 910, height: 1100 }));

  return element;
};

describe(scrollMetricsOf, () => {
  it('reads the box the way a browser measures it', () => {
    expect(scrollMetricsOf(box({ scrollHeight: 2740, clientHeight: 800 }))).toEqual({ top: 0, content: 2740, viewport: 800 });
  });

  it('takes the drawn height for a viewport Gameface leaves without clientHeight', () => {
    expect(scrollMetricsOf(box({ scrollHeight: 2740 })).viewport).toBe(500);
  });

  it('takes the span of the children for content Gameface leaves without scrollHeight', () => {
    expect(scrollMetricsOf(box({ clientHeight: 800 })).content).toBe(2000);
  });
});

describe(scrollMaxOf, () => {
  it('lets a box without scrollHeight scroll to the end of its children', () => {
    expect(scrollMaxOf(box({ clientHeight: 800 }))).toBe(1200);
  });

  it('lets a box without clientHeight scroll by what its drawn height hides', () => {
    expect(scrollMaxOf(box({ scrollHeight: 2740 }))).toBe(2240);
  });

  it('never goes below zero when everything fits', () => {
    expect(scrollMaxOf(box({ scrollHeight: 300, clientHeight: 800 }))).toBe(0);
  });
});
