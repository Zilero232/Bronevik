import type { ArmorModelResponse } from '@otmetki/schemas';

import { armorModelSchema } from '@otmetki/schemas';

import type { ArmorModelInput } from './armor.types';

import { api } from '../http';
import { fromServer } from '../source';

export const getArmorModel = ({ idOrSlug, signal }: ArmorModelInput): Promise<ArmorModelResponse> =>
  fromServer(async () => {
    const { data } = await api.get(`/tanks/${encodeURIComponent(idOrSlug)}/armor`, { signal });

    return armorModelSchema.parse(data);
  });
