import type { PlayerSearchResult, TankSearchResult } from '@bronevik/schemas';

export type PickableKind = 'player' | 'tank';

export type PickableResult<K extends PickableKind> = K extends 'player' ? PlayerSearchResult : TankSearchResult;

export type UseEntitySearchInput<K extends PickableKind> = {
  kind: K;
  query: string;
};
