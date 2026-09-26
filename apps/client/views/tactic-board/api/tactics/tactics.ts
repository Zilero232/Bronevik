import type { TacticBoard, UpdateTacticBoardInput } from '@/entities/tactic/board';
import { tacticsControllerRotate, tacticsControllerUpdate } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

const tokenQuery = (token: string | null) => (token ? { token } : undefined);

export const updateTacticBoard = ({ id, token, patch }: UpdateTacticBoardInput): Promise<TacticBoard> =>
  fromSdk(() => tacticsControllerUpdate({ ...SESSION_REQUEST, path: { id }, query: tokenQuery(token), body: patch }));

export const rotateTacticBoardTokens = (id: string): Promise<TacticBoard> =>
  fromSdk(() => tacticsControllerRotate({ ...SESSION_REQUEST, path: { id } }));
