import type { BoardRole, BoardRoleInput } from './board-access.types';

import { timingSafeEqual } from '../../../../common/lib';

const matches = (token: string | null, expected: string): boolean => token !== null && timingSafeEqual(token, expected);

export const boardRole = ({ board, userId, token }: BoardRoleInput): BoardRole | null => {
  if (userId !== null && board.ownerUserId === userId) {
    return 'owner';
  }

  if (board.visibility === 'private') {
    return null;
  }

  if (matches(token, board.editToken)) {
    return 'edit';
  }

  if (matches(token, board.shareToken) || board.visibility === 'public') {
    return 'view';
  }

  return null;
};

export const canEdit = (role: BoardRole | null): boolean => role === 'owner' || role === 'edit';
