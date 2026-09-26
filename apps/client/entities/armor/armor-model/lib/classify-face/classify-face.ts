import { calculateArmorHit, hasArmorFlag, isHollowPlate } from '@otmetki/gamedata';

import type { ArmorFaceClass } from '../../model/armor-model.types';
import type { ClassifyFaceInput } from './classify-face.types';

export const classifyFace = ({ thickness, flags, angle, shell, randomness }: ClassifyFaceInput): ArmorFaceClass => {
  if (hasArmorFlag({ flags, flag: 'module' })) {
    return 'module';
  }

  if (isHollowPlate({ thickness, flags })) {
    return 'hollow';
  }

  if (hasArmorFlag({ flags, flag: 'spaced' }) || hasArmorFlag({ flags, flag: 'track' })) {
    return 'spaced';
  }

  const { verdict } = calculateArmorHit({ thickness, angle, shell, flags, randomness });

  return verdict === 'hollow' ? 'hollow' : verdict;
};
