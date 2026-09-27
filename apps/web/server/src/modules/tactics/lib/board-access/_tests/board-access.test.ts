import { describe, expect, it } from 'vitest';

import { boardRole, canEdit } from '../board-access';

const board = { ownerUserId: 'owner', shareToken: 'view-token', editToken: 'edit-token', visibility: 'unlisted' as const };

describe('boardRole', () => {
  it('recognises the owner without any token', () => {
    expect(boardRole({ board, userId: 'owner', token: null })).toBe('owner');
  });

  it('grants editing only with the edit token', () => {
    expect(boardRole({ board, userId: 'guest', token: 'edit-token' })).toBe('edit');
    expect(boardRole({ board, userId: null, token: 'view-token' })).toBe('view');
  });

  it('denies an unlisted board to strangers and wrong tokens', () => {
    expect(boardRole({ board, userId: 'guest', token: null })).toBeNull();
    expect(boardRole({ board, userId: null, token: 'edit-tokem' })).toBeNull();
  });

  it('keeps a private board to its owner even with valid tokens', () => {
    expect(boardRole({ board: { ...board, visibility: 'private' }, userId: null, token: 'edit-token' })).toBeNull();
  });

  it('lets anyone view a public board', () => {
    expect(boardRole({ board: { ...board, visibility: 'public' }, userId: null, token: null })).toBe('view');
  });
});

describe('canEdit', () => {
  it('is true only for the owner and editors', () => {
    expect([canEdit('owner'), canEdit('edit'), canEdit('view'), canEdit(null)]).toEqual([true, true, false, false]);
  });
});
