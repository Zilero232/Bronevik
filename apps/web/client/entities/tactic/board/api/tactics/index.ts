export { getTacticBoard, listMyTacticBoards } from './tactics';
export type {
  CreateTacticBoard,
  TacticBoard,
  TacticBoardData,
  TacticBoardInput,
  TacticBoardRole,
  TacticBoardVisibility,
  TacticIcon,
  TacticIconKind,
  TacticLayer,
  TacticStroke,
  TacticStrokeTool,
  UpdateTacticBoard,
  UpdateTacticBoardInput
} from './tactics.types';
export { zCreateTacticBoard, zTacticBoard, zUpdateTacticBoard } from '@/shared/api/generated/zod.gen';
