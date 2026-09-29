import type { PIN_SCOPES } from '../../config';

export type PinScope = keyof typeof PIN_SCOPES;

export type TogglePinnedIdInput = {
  ids: readonly string[];
  id: string;
  limit: number;
};
