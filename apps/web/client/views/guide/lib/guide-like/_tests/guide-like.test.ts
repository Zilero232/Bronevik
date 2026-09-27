import { describe, expect, it } from 'vitest';

import { applyLike } from '../guide-like';

describe('applyLike', () => {
  it('adds one like when the viewer likes', () => {
    expect(applyLike({ state: { liked: false, likesCount: 4 }, liked: true })).toEqual({ liked: true, likesCount: 5 });
  });

  it('removes one like when the viewer unlikes', () => {
    expect(applyLike({ state: { liked: true, likesCount: 5 }, liked: false })).toEqual({ liked: false, likesCount: 4 });
  });

  it('leaves the count alone when the state already matches', () => {
    expect(applyLike({ state: { liked: true, likesCount: 5 }, liked: true })).toEqual({ liked: true, likesCount: 5 });
    expect(applyLike({ state: { liked: false, likesCount: 0 }, liked: false })).toEqual({ liked: false, likesCount: 0 });
  });

  it('never goes below zero on a stale count', () => {
    expect(applyLike({ state: { liked: true, likesCount: 0 }, liked: false }).likesCount).toBe(0);
  });
});
