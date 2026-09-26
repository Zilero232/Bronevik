import type { TankReference } from '@otmetki/ratings';

import { BRONYA_COMPONENTS, BRONYA_INDEX } from '@otmetki/ratings';
import { z } from 'zod';

import type { BronyaReferencePayload, ParseBronyaReferenceInput } from './bronya-reference.types';

import { BRONYA_REFERENCE } from './bronya-reference.constants';

const quantiles = z.array(z.number()).length(BRONYA_INDEX.quantileLevels.length);

const payloadSchema = z.object({
  kind: z.literal(BRONYA_REFERENCE.kind),
  players: z.number(),
  levels: z.array(z.number()),
  components: z.object({ damage: quantiles, winRate: quantiles, frags: quantiles, spotted: quantiles, defence: quantiles })
});

export const bronyaReferencePayload = ({ players, components }: Omit<BronyaReferencePayload, 'kind' | 'levels'>): BronyaReferencePayload => ({
  kind: BRONYA_REFERENCE.kind,
  players,
  levels: [...BRONYA_INDEX.quantileLevels],
  components
});

export const parseBronyaReference = ({ tankId, value }: ParseBronyaReferenceInput): TankReference | null => {
  const parsed = payloadSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  const increasing = BRONYA_COMPONENTS.every((component) =>
    parsed.data.components[component].every((point, index, list) => index === 0 || point >= (list[index - 1] ?? point))
  );

  return increasing ? { tankId, quantiles: parsed.data.components } : null;
};
