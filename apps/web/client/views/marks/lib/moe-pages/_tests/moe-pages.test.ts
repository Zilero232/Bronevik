import { describe, expect, it } from 'vitest';

import { nextOffset } from '../moe-pages';

const page = (offset: number, size: number, total: number) => ({
  items: Array.from({ length: size }, (_, index) => offset + index),
  total,
  limit: size,
  offset
});

describe('nextOffset', () => {
  it('points right after the last loaded row while rows remain', () => {
    expect(nextOffset(page(0, 100, 250))).toBe(100);
  });

  it('stops once the last page has been loaded', () => {
    expect(nextOffset(page(200, 50, 250))).toBeUndefined();
  });

  it('stops on an empty page so a wrong total cannot loop forever', () => {
    expect(nextOffset(page(100, 0, 250))).toBeUndefined();
  });
});
