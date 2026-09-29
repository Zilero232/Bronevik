// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useRowFigure } from '../use-row-figure';

describe(useRowFigure, () => {
  it('places the shapes and the marks in percent with stable keys', () => {
    const hook = renderHook(() =>
      useRowFigure({
        shapes: [{ x: 0.2, y: 0.1, w: 0.6, h: 0.82 }],
        marks: [
          { x: 0.5, y: 0.12, tone: 'pen' },
          { x: 0.5, y: 0.12, tone: 'ricochet' }
        ]
      })
    );

    expect(hook.current().shapes).toEqual([{ key: 'shape-0', style: { left: '20%', top: '10%', width: '60%', height: '82%' } }]);

    expect(hook.current().marks.map((mark) => [mark.key, mark.tone])).toEqual([
      ['mark-0', 'pen'],
      ['mark-1', 'ricochet']
    ]);
  });
});
