import { describe, expect, it } from 'vitest';

import { boardDocumentName, boardSocketToken, boardSocketUrl } from '../board-socket';

describe('boardSocketUrl', () => {
  it('switches plain http to ws', () => {
    expect(boardSocketUrl({ apiUrl: 'http://localhost:4000', path: '/tactics/ws' })).toBe('ws://localhost:4000/tactics/ws');
  });

  it('switches https to wss', () => {
    expect(boardSocketUrl({ apiUrl: 'https://api.otmetki.su', path: '/tactics/ws' })).toBe('wss://api.otmetki.su/tactics/ws');
  });

  it('keeps a path prefix of the api url without doubling slashes', () => {
    expect(boardSocketUrl({ apiUrl: 'https://otmetki.su/api/', path: '/tactics/ws' })).toBe('wss://otmetki.su/api/tactics/ws');
  });
});

describe('boardDocumentName', () => {
  it('prefixes the board id the way the server parses it', () => {
    expect(boardDocumentName('0b7a4c1e-7f55-4f5e-9b1a-2c3d4e5f6a7b')).toBe('board:0b7a4c1e-7f55-4f5e-9b1a-2c3d4e5f6a7b');
  });
});

describe('boardSocketToken', () => {
  it('prefers the edit token so editors connect writable', () => {
    expect(boardSocketToken({ editToken: 'edit-token', urlToken: 'share-token', shareToken: null })).toBe('edit-token');
  });

  it('falls back to the token from the link for viewers', () => {
    expect(boardSocketToken({ editToken: null, urlToken: 'share-token', shareToken: null })).toBe('share-token');
  });

  it('sends an empty token for a public board opened without a link token', () => {
    expect(boardSocketToken({ editToken: null, urlToken: null, shareToken: null })).toBe('');
  });
});
