import type { CreateTacticBoard, TacticBoard, TacticBoardInput, UpdateTacticBoardInput } from './tactics.types';

import {
  tacticsControllerCreate,
  tacticsControllerMine,
  tacticsControllerOpen,
  tacticsControllerRemove,
  tacticsControllerRotate,
  tacticsControllerUpdate
} from '../generated';
import { SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

const tokenQuery = (token: string | null) => (token ? { token } : undefined);

export const listMyTacticBoards = (signal?: AbortSignal): Promise<TacticBoard[]> =>
  fromSdk(() => tacticsControllerMine({ ...SESSION_REQUEST, signal }));

export const createTacticBoard = (body: CreateTacticBoard): Promise<TacticBoard> =>
  fromSdk(() => tacticsControllerCreate({ ...SESSION_REQUEST, body }));

export const getTacticBoard = ({ id, token, signal }: TacticBoardInput): Promise<TacticBoard> =>
  fromSdk(() => tacticsControllerOpen({ ...SESSION_REQUEST, path: { id }, query: tokenQuery(token), signal }));

export const updateTacticBoard = ({ id, token, patch }: UpdateTacticBoardInput): Promise<TacticBoard> =>
  fromSdk(() => tacticsControllerUpdate({ ...SESSION_REQUEST, path: { id }, query: tokenQuery(token), body: patch }));

export const rotateTacticBoardTokens = (id: string): Promise<TacticBoard> =>
  fromSdk(() => tacticsControllerRotate({ ...SESSION_REQUEST, path: { id } }));

export const removeTacticBoard = async (id: string): Promise<void> => {
  await fromSdk(() => tacticsControllerRemove({ ...SESSION_REQUEST, path: { id } }));
};
