import { tacticsControllerMine, tacticsControllerOpen } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { TacticBoard, TacticBoardInput } from './tactics.types';

export const listMyTacticBoards = (signal?: AbortSignal): Promise<TacticBoard[]> =>
  fromSdk(() => tacticsControllerMine({ ...SESSION_REQUEST, signal }));

export const getTacticBoard = ({ id, token, signal }: TacticBoardInput): Promise<TacticBoard> =>
  fromSdk(() => tacticsControllerOpen({ ...SESSION_REQUEST, path: { id }, query: token ? { token } : undefined, signal }));
