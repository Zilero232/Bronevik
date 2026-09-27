import type { ArmorModelResponse } from '@otmetki/schemas';

import { armorModelSchema } from '@otmetki/schemas';

import { api } from '@/shared/api/http';
import { fromServer } from '@/shared/api/source';

import type { ArmorModelInput } from './armor.types';

export const getArmorModel = ({ idOrSlug, signal }: ArmorModelInput): Promise<ArmorModelResponse> =>
  fromServer(async () => {
    const { data } = await api.get(`/tanks/${encodeURIComponent(idOrSlug)}/armor`, { signal });

    return armorModelSchema.parse(data);
  });
