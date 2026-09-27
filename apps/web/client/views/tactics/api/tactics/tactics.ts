import type { CreateTacticBoard, TacticBoard } from '@/entities/tactic/board';

import { tacticsControllerCreate, tacticsControllerRemove } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const createTacticBoard = (body: CreateTacticBoard): Promise<TacticBoard> =>
  fromSdk(() => tacticsControllerCreate({ ...SESSION_REQUEST, body }));

export const removeTacticBoard = async (id: string): Promise<void> => {
  await fromSdk(() => tacticsControllerRemove({ ...SESSION_REQUEST, path: { id } }));
};
