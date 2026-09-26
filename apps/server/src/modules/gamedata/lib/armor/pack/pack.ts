import type { ArmorGeometry } from '@bronevik/gamedata';

import { encodeArmorGeometry } from '@bronevik/gamedata';
import { createHash } from 'node:crypto';

import type { ArmorStorageKeyInput, PackedArmorModel } from './pack.types';

import { ARMOR_PACK } from './pack.constants';

export const packArmorGeometry = (geometry: ArmorGeometry): PackedArmorModel => {
  const bytes = encodeArmorGeometry(geometry);

  return { bytes, hash: createHash('sha256').update(bytes).digest('hex').slice(0, ARMOR_PACK.hashLength) };
};

export const armorStorageKey = ({ tankId, hash }: ArmorStorageKeyInput): string => `${ARMOR_PACK.keyPrefix}/${tankId}/${hash}${ARMOR_PACK.extension}`;
