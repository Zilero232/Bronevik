import type { ArmorModelResponse } from '@otmetki/schemas';

import { base64ToBytes, decodeArmorGeometry } from '@otmetki/gamedata';

import type { ArmorModelData } from '../../model/armor-model.types';

export const decodeArmorModel = (response: ArmorModelResponse): ArmorModelData => ({
  response,
  geometry: decodeArmorGeometry(base64ToBytes(response.geometry))
});
