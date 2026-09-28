import type { HudMessage, HudState } from './hud-protocol.types';

import { gameface } from '../gameface';
import { hudStateSchema } from './hud-protocol.schemas';

export const parseHudState = (raw: string): HudState | null => {
  let data: unknown;

  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  const parsed = hudStateSchema.safeParse(data);

  return parsed.success ? parsed.data : null;
};

export const sendHud = (message: HudMessage): boolean => gameface.send(JSON.stringify(message));
