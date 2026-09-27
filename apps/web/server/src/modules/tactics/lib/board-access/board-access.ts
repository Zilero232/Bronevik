import type { BoardRole, BoardRoleInput, TokenMatchInput } from './board-access.types';

import { timingSafeEqual } from '../../../../common/lib';

const matches = ({ token, expected }: TokenMatchInput): boolean => token !== null && timingSafeEqual({ left: token, right: expected });

export const boardRole = ({ board, userId, token }: BoardRoleInput): BoardRole | null => {
  if (userId !== null && board.ownerUserId === userId) {
    return 'owner';
  }

  if (board.visibility === 'private') {
    return null;
  }

  if (matches({ token, expected: board.editToken })) {
    return 'edit';
  }

  if (matches({ token, expected: board.shareToken }) || board.visibility === 'public') {
    return 'view';
  }

  return null;
};

export const canEdit = (role: BoardRole | null): boolean => role === 'owner' || role === 'edit';
