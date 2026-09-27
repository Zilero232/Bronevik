import type { UiMessage, UiState } from './protocol.types';

import { gameface } from '../gameface';
import { stateSchema } from './protocol.schemas';

export const parseState = (raw: string): UiState | null => {
  let data: unknown;

  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  const parsed = stateSchema.safeParse(data);

  return parsed.success ? parsed.data : null;
};

export const send = (message: UiMessage): boolean => gameface.send(JSON.stringify(message));
