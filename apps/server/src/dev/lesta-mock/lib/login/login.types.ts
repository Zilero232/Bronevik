import type { Request, Response } from 'express';

import type { MockPlayer, MockWorld } from '../../lesta-mock.types';

export type LoginRouterInput = {
  world: MockWorld;
  apiUrl: string;
};

export type PickerRow = {
  player: MockPlayer;
  clanTag: string | null;
  winRate: number;
  rating: number;
};

export type IsAllowedRedirectInput = {
  redirectUri: string;
  apiUrl: string;
};

export type RowOfInput = {
  world: MockWorld;
  player: MockPlayer;
};

export type SearchInput = {
  world: MockWorld;
  query: string;
};

export type PageInput = {
  request: Request;
  rows: readonly PickerRow[];
};

export type RedirectWithInput = {
  redirectUri: string;
  values: Record<string, string>;
};

export type GuardInput = {
  request: Request;
  response: Response;
};
