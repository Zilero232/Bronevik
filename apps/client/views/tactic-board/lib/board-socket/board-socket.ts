import type { BoardSocketTokenInput, BoardSocketUrlInput } from './board-socket.types';

import { BOARD_SOCKET } from '../../config';

export const boardSocketUrl = ({ apiUrl, path }: BoardSocketUrlInput): string => {
  const url = new URL(apiUrl);
  const base = url.pathname.replace(/\/+$/, '');

  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = `${base}${path}`;
  url.search = '';
  url.hash = '';

  return url.toString();
};

export const boardDocumentName = (boardId: string): string => `${BOARD_SOCKET.documentPrefix}${boardId}`;

export const boardSocketToken = ({ editToken, urlToken, shareToken }: BoardSocketTokenInput): string => editToken ?? urlToken ?? shareToken ?? '';
