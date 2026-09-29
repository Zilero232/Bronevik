import type { ArmorAttackerData } from '@otmetki/schemas';

import { armorAttackerSchema } from '@otmetki/schemas';

import { api } from '@/shared/api/http';
import { fromServer } from '@/shared/api/source';

import type { ArmorGunsInput } from './armor-guns.types';

export const getArmorGuns = ({ idOrSlug, signal }: ArmorGunsInput): Promise<ArmorAttackerData> =>
  fromServer(async () => {
    const { data } = await api.get(`/tanks/${encodeURIComponent(idOrSlug)}/armor/guns`, { signal });

    return armorAttackerSchema.parse(data);
  });
