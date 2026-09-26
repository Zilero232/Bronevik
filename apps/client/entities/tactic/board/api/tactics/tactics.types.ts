import type { CreateTacticBoard, TacticBoard, UpdateTacticBoard } from '@/shared/api/generated';

export type { CreateTacticBoard, TacticBoard, UpdateTacticBoard };

export type TacticBoardData = TacticBoard['data'];

export type TacticLayer = TacticBoardData['layers'][number];

export type TacticStroke = TacticLayer['strokes'][number];

export type TacticIcon = TacticLayer['icons'][number];

export type TacticStrokeTool = TacticStroke['tool'];

export type TacticIconKind = TacticIcon['kind'];

export type TacticBoardRole = TacticBoard['role'];

export type TacticBoardVisibility = TacticBoard['visibility'];

export type TacticBoardInput = {
  id: string;
  token: string | null;
  signal?: AbortSignal;
};

export type UpdateTacticBoardInput = {
  id: string;
  token: string | null;
  patch: UpdateTacticBoard;
};
