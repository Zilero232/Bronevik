import type { TacticBoard } from '../../../../../generated';

export type BoardRole = 'edit' | 'owner' | 'view';

export type BoardRoleInput = {
  board: Pick<TacticBoard, 'editToken' | 'ownerUserId' | 'shareToken' | 'visibility'>;
  userId: string | null;
  token: string | null;
};

export type TokenMatchInput = {
  token: string | null;
  expected: string;
};
