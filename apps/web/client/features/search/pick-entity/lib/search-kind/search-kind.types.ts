import type { PlayerSearchResult, TankSearchResult } from '@otmetki/schemas';

export type PickableKind = 'player' | 'tank';

export type PickableResult<K extends PickableKind> = K extends 'player' ? PlayerSearchResult : TankSearchResult;
