import { describe, expect, it } from 'vitest';

import { createBoardId } from '../board-id';

describe('createBoardId', () => {
  it('fits the 64-character id limit of the board schema', () => {
    const id = createBoardId();

    expect(id.length).toBeGreaterThan(0);
    expect(id.length).toBeLessThanOrEqual(64);
  });

  it('does not repeat across many calls', () => {
    const ids = new Set(Array.from({ length: 500 }, createBoardId));

    expect(ids.size).toBe(500);
  });
});
