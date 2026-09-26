import { describe, expect, it } from 'vitest';

import { updateTacticBoardSchema } from '../tactics.schemas';

describe('updateTacticBoardSchema', () => {
  it('keeps the drawing and visibility untouched when the board is renamed', () => {
    expect(updateTacticBoardSchema.parse({ title: 'Himmelsdorf push' })).toEqual({ title: 'Himmelsdorf push' });
  });
});
