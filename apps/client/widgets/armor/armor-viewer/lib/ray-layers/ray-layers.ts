import { hasArmorFlag } from '@bronevik/gamedata';
import { sortBy } from 'remeda';

import type { HitLayer } from '@/features/armor/armor-inspect';

import type { ToHitLayersInput } from './ray-layers.types';

const DEGREES = 180 / Math.PI;

export const toHitLayers = ({ hits, hideSpaced }: ToHitLayersInput): HitLayer[] => {
  const visible = sortBy(
    hits.filter(({ plate }) => plate && !(hideSpaced && hasArmorFlag({ flags: plate.flags, flag: 'spaced' }))),
    ({ distance }) => distance
  );

  const entering = Math.sign(visible[0]?.cosine ?? 0);

  return visible
    .filter(({ cosine }) => Math.sign(cosine) === entering)
    .flatMap(({ distance, piece, plate, cosine }) =>
      plate
        ? [
            {
              piece,
              plate: plate.name,
              thickness: plate.thickness,
              flags: plate.flags,
              angle: Math.acos(Math.min(1, Math.abs(cosine))) * DEGREES,
              distance
            }
          ]
        : []
    );
};
