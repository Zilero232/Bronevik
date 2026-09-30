import { describe, expect, it } from 'vitest';

import { inputAreaKey, inputAreaOf } from '../input-area';

const screen = { width: 1920, height: 1080 };

describe(inputAreaOf, () => {
  it('takes the whole screen while a hangar edit or a drag needs it', () => {
    expect(inputAreaOf({ whole: true, screen, rects: [] })).toEqual({ left: 0, top: 0, width: 1920, height: 1080 });
  });

  it('lets every click through when no panel takes the mouse', () => {
    expect(inputAreaOf({ whole: false, screen, rects: [] })).toEqual({ left: 0, top: 0, width: 0, height: 0 });
  });

  it('covers only the clickable panels', () => {
    const area = inputAreaOf({ whole: false, screen, rects: [{ left: 1870.4, top: 90, width: 36, height: 36 }] });

    expect(area).toEqual({ left: 1870, top: 90, width: 37, height: 36 });
    expect(inputAreaKey(area)).toBe('1870,90,37,36');
  });
});
